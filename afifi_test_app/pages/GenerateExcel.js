import * as XLSX from "xlsx";

export default function generateExcelFile(map, filters) {
  var wb = XLSX.utils.book_new();
  // For each product, fill up the sheet
  map.forEach((values, keys) => {
    let titles = [""];
    let skuArr = [""];
    let qtyArr = [""];
    //For each variant, populate accordingly
    values.forEach((value) => {
      if (value.node.inventoryQuantity !== 0) {
        titles.push(value.node.title);
        titles.push(" ");
        if (value.node.sku !== "") {
          skuArr.push(value.node.sku);
          skuArr.push(" ");
        }
        if (value.node.inventoryQuantity !== 0) {
          qtyArr.push(value.node.inventoryQuantity);
          qtyArr.push(" ");
        }
      }
    });
    let arrOfValues = [];
    arrOfValues.push(titles);

    if (skuArr.length !== 1) {
      arrOfValues.push(skuArr);
    }
    if (qtyArr.length !== 1) {
      arrOfValues.push(qtyArr);
    }
    if (arrOfValues.length > 1) {
      let tempValue = generateColumnNumbering(qtyArr);
      let newArr = arrOfValues.concat(tempValue);
      var ws = XLSX.utils.aoa_to_sheet(newArr);
      XLSX.utils.book_append_sheet(wb, ws, keys);
    }
  });
  XLSX.writeFile(wb, "GenerateExcelFile.xlsx");
}

function generateColumnNumbering(quantityArray) {
  let tempArr = [];
  let u = 1;
  //Get max value from the array
  let maxQty = Math.max.apply(Math, quantityArray);
  while (u <= maxQty) {
    let tempArr1 = [];
    for (var i = 1; i < quantityArray.length; i = i + 2) {
      if (quantityArray[i] >= u) {
        tempArr1.push(u);
      } else {
        tempArr1.push(" ");
      }
      tempArr1.push(" ");
    }
    //After row 1 is done, push the row to Array
    tempArr.push(tempArr1);
    u = u + 1;
  }
  return tempArr;
}
