import store from "store-js";
var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "94247704",
  database: "shopify_app",
});

export function connectToDb() {
  con.connect(function (err) {
    if (err) {
      throw err;
    }
    console.log("DB has been connected successfully!");
  });
}

export function saveUserDetails(shopName, accessToken) {
  let query = `INSERT INTO usernameKeys 
        (username, accesstoken, timeCreated) VALUES (?, ?, ?);`;

  con.query(query, [shopName, accessToken, new Date()], (err, rows) => {
    if (err) throw err;
    console.log("Row inserted with id = " + rows.insertId);
  });
}

export async function saveImportTransactionDetails(
  transactionType,
  shopName,
  numberOfOrders
) {
  let maxOrderIDQuery = `select max(orderID) as maxid from importHistory where username = "${shopName}"`;

  let query = `INSERT INTO importHistory 
        (dateCreated, dateCompleted, typeOfTransaction, username, numberOfOrders, orderID) VALUES (?, ?, ?, ?, ?, ?);`;
  con.query(maxOrderIDQuery, (err, result, fields) => {
    if (err) throw err;
    console.log("Result = ");
    let maxOrderID = result[0].maxid;
    con.query(
      query,
      [
        new Date(),
        new Date(),
        transactionType,
        shopName,
        parseInt(numberOfOrders),
        maxOrderID + 1,
      ],
      (err, rows) => {
        if (err) throw err;
        console.log("Row inserted with id = " + rows.insertId);
      }
    );
  });
}

export async function saveProductExportTransactionDetails(
  shopName,
  numberOfProducts
) {
  let maxOrderIDQuery = `select max(orderID) as maxid from productexporthistory where username = "${shopName}"`;

  let query = `INSERT INTO productExportHistory 
        (dateCreated, dateCompleted, typeOfTransaction, username, numberOfProducts, orderID) VALUES (?, ?, ?, ?, ?, ?);`;

  con.query(maxOrderIDQuery, (err, result, fields) => {
    if (err) throw err;
    console.log("Result = ");
    let maxOrderID = result[0].maxid;
    con.query(
      query,
      [
        new Date(),
        new Date(),
        "export",
        shopName,
        numberOfProducts,
        maxOrderID + 1,
      ],
      (err, rows) => {
        if (err) throw err;
        console.log("Export request saved for shop:", shopName);
      }
    );
  });
}

export function getPreviousExports(shopName) {
  let query = `select * from productexporthistory where username = "${shopName}"`;
  let resultInJSON;
  return new Promise((resolve, reject) => {
    con.query(query, (err, result, fields) => {
      if (err) return reject(err);
      console.log("Result = ");
      resultInJSON = JSON.parse(JSON.stringify(result));
      resolve(resultInJSON);
    });
  });
}

export function getPreviousImports(shopName) {
  let query = `select * from importhistory where username = "${shopName}"`;
  let resultInJSON;
  return new Promise((resolve, reject) => {
    con.query(query, (err, result, fields) => {
      if (err) return reject(err);
      console.log("Result = ");
      console.log(result);
      let resultInJSON = JSON.parse(JSON.stringify(result));
      console.log(resultInJSON);
      resolve(resultInJSON);
    });
  });
}

export function disconnectFromDb() {
  con.end(function (err) {
    if (err) {
      return console.log("error:" + err.message);
    }
    console.log("Closed the database connection.");
  });
}
