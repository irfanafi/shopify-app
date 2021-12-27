import { Button } from "@shopify/polaris";
import gql from "graphql-tag";
import * as XLSX from "xlsx";
import "@babel/polyfill";
import { useState } from "react";
import axios from "axios";

function ImportButton(props) {
  const [importState, setImport] = useState(true);

  return (
    <div style={{ float: "right", marginTop: "10px" }}>
      {importState ? (
        <Button onClick={() => parseExcelFile(props.fileUploaded, setImport)}>
          Import
        </Button>
      ) : (
        <Button disabled={true}>Import in Progress</Button>
      )}
    </div>
  );
}

export default ImportButton;

function parseExcelFile(file, setImport) {
  var name = file.name;
  const reader = new FileReader();
  var userOverallOrders = new Map();
  reader.onload = (evt) => {
    // evt = on_file_select event
    /* Parse data */
    const bstr = evt.target.result;
    const wb = XLSX.read(bstr, { type: "binary" });
    /* Get first worksheet */
    const numberOfSheets = wb.SheetNames.length;
    for (let i = 0; i < numberOfSheets; i++) {
      const wsname = wb.SheetNames[i];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_row_object_array(ws, { header: 1 });
      /* Update state */
      console.log("Data>>>" + data[0]);
      //Get the columns index
      let actualColumnsArr = getIndexOfColumnsWithHeaders(data);
      //Get User names from the sheet
      let userOrdersPerSheet = new Map();
      userOrdersPerSheet = getNameOfUsers(data, actualColumnsArr);
      let userKeys = Array.from(userOrdersPerSheet.keys());
      userKeys.forEach((username) => {
        if (userOverallOrders.has(username)) {
          let orderArr = userOverallOrders.get(username);
          orderArr = orderArr.concat(userOrdersPerSheet.get(username));
          userOverallOrders.set(username, orderArr);
        } else
          userOverallOrders.set(username, userOrdersPerSheet.get(username));
      });
    }
    importDraftOrders(userOverallOrders);
    setImport(false);
  };
  reader.readAsBinaryString(file);
}

function getIndexOfColumnsWithHeaders(data) {
  let columnsArr = [];
  let numberOfColumns = data[0].length;
  for (let i = 0; i < numberOfColumns; i++) {
    if (data[0][i] === null || data[0][i].match(/^ *$/) !== null)
      console.log("Is empty");
    else {
      columnsArr.push(i);
    }
  }
  return columnsArr;
}

function getNameOfUsers(data, actualColumnsArr) {
  let nameOfUsersArr = [];
  for (let i = 3; i < data.length; i++) {
    for (let j = 0; j < data[0].length; j++) {
      if (
        actualColumnsArr.includes(j) &&
        !(data[i][j] === null || data[i][j].match(/^ *$/) !== null)
      ) {
        console.log(i, j);
        nameOfUsersArr.push(data[i][j]);
      }
    }
  }
  //Get Unique names
  nameOfUsersArr = [...new Set(nameOfUsersArr)];
  let orderList = new Map();
  nameOfUsersArr.forEach((currentValue, index, arr) => {
    let eachUserOrder = [];
    for (let i = 3; i < data.length; i++) {
      for (let j = 0; j < data[0].length; j++) {
        if (actualColumnsArr.includes(j) && data[i][j] === currentValue) {
          eachUserOrder.push(String(data[1][j]));
        }
      }
    }
    orderList.set(currentValue, eachUserOrder);
  });
  return orderList;
}

function importDraftOrders(ordersMap) {
  let userKeys = Array.from(ordersMap.keys());
  let userOrderArr;
  for (let i = 0; i < userKeys.length; i++) {
    userOrderArr = ordersMap.get(userKeys[i]);
    var draftQuery = constructGraphQlQuery(userKeys[i], userOrderArr);
    axios
      .post("/importOrder", draftQuery)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
  axios
    .post("/saveImportDetails", { numberOfOrders: userKeys.length })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

function constructGraphQlQuery(username, orderArr) {
  let lineItemsArr = [];
  orderArr.forEach((currentValue, index, arr) => {
    //get VariantID here?

    let lineItem = `{quantity: 1, variantId:"gid://shopify/ProductVariant/41310436196551"}`;
    lineItemsArr.push(lineItem);
  });
  return gql`
        mutation{
            draftOrderCreate(input:{note: "${username}", lineItems:[${lineItemsArr}]})
                    {
                        draftOrder{
                            invoiceUrl
                            },
                                userErrors{
                                message
                                }
                }
        }
    `;
}
