var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayProducts();
  // connection.end();
});

function displayProducts() {
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("These products are available for sale:")
    for (var i = 0; i < res.length; i++) {
      console.log("Item ID " + res[i].item_id + ": " + res[i].product_name + " $" + res[i].price);
    }
    purchase();
  })
}

function purchase() {
  inquirer
    .prompt([{
      type: "input",
      name: "itemID",
      message: "Please input the Item ID of the product you would like to purchase.",
      validate: function (value) {
        if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= 10) {
          return true;
        }
        return false;
      }
    }, {
      type: "input",
      name: "units",
      message: "How many units of this product would you like to purchase?"
    }]).then(function (answers) {
      connection.query("Select stock_quantity FROM products WHERE item_id = ?", [answers.itemID], function (err, res) {
        if (err) throw err;
        if (answers.units <= res[0].stock_quantity) {
          console.log("Order submitted");
        } else {
          console.log("Sorry, insufficient quantity!")
        }
      })
    })
}

