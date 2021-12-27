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
  let query = `INSERT INTO importHistory 
        (dateCreated, dateCompleted, typeOfTransaction, username, numberOfOrders, orderNumber) VALUES (?, ?, ?, ?, ?, ?);`;

  con.query(
    query,
    [
      new Date(),
      new Date(),
      transactionType,
      shopName,
      parseInt(numberOfOrders),
    ],
    (err, rows) => {
      if (err) throw err;
      console.log("Row inserted with id = " + rows.insertId);
    }
  );
}

export function getPreviousExport() {}

export function getPreviousImports() {}

export function disconnectFromDb() {
  con.end(function (err) {
    if (err) {
      return console.log("error:" + err.message);
    }
    console.log("Closed the database connection.");
  });
}
