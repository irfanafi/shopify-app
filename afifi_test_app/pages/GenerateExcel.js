import axios from "axios";
import * as XLSX from "xlsx";

export function generateExcelFile(map, filters) {
  let numberOfProducts = 0;
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
        titles.push(null);
        if (value.node.sku !== "") {
          skuArr.push(value.node.sku);
          skuArr.push(null);
        }
        if (value.node.inventoryQuantity !== 0) {
          qtyArr.push(value.node.inventoryQuantity);
          qtyArr.push(null);
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
      numberOfProducts = numberOfProducts + 1;
    }
  });
  XLSX.writeFile(wb, "GenerateExcelFile.xlsx");
  axios
    .post("/saveProductExportDetails", { noOfProducts: numberOfProducts })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
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
