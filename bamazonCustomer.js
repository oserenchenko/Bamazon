var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('easy-table');

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
});

function displayProducts() {
  var data = [];
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    var amountProducts = res.length;
    console.log("These products are available for sale:")
    for (var i = 0; i < res.length; i++) {
      data.push({
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: res[i].price
      })
    }
    var t = new Table
    data.forEach(function (product) {
      t.cell('Item ID', product.item_id)
      t.cell('Product Name', product.product_name)
      t.cell('Price', product.price, Table.number(2))
      t.newRow()
    })
    console.log(t.toString())
    purchase(amountProducts);
  })
}

function purchase(numOfProd) {
  inquirer
    .prompt([{
      type: "input",
      name: "itemID",
      message: "Please input the Item ID of the product you would like to purchase.",
      validate: function (value) {
        if (isNaN(value) === false && parseInt(value) > 0 && parseInt(value) <= numOfProd) {
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
          console.log("Submitting Order...");
          var unitsLeft = res[0].stock_quantity - answers.units;
          connection.query("UPDATE products SET stock_quantity = ? WHERE item_id = ?", [unitsLeft, answers.itemID], function (err, res) {
            if (err) throw err;
            connection.query("Select price FROM products WHERE item_id = ?", [answers.itemID], function (err, res) {
              if (err) throw err;
              var totalCost = answers.units * res[0].price;
              console.log("Order submitted. Your total cost is $" + totalCost);
              connection.query("Select product_sales FROM products WHERE item_id = ?", [answers.itemID], function (err, res) {
                if (err) throw err;
                var updateCost = res[0].product_sales + totalCost;
                connection.query("UPDATE products SET product_sales = ? WHERE item_id = ?", [updateCost, answers.itemID], function (err, res) {
                  if (err) throw err;
                  inquirer
                    .prompt([{
                      type: "confirm",
                      name: "exit",
                      message: "Would you like to exit?"
                    }]).then(function (answers) {
                      if (answers.exit) {
                        connection.end();
                      } else {
                        displayProducts();
                      }
                    })
                })
              });
            })
          })
        } else {
          console.log("Sorry, insufficient quantity!")
          displayProducts();
        }
      })
    })
}