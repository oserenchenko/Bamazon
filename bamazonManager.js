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
  start();
});

function viewProducts() {
  var data = [];
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    console.log("Here are all of the products for sale:")
    for (var i = 0; i < res.length; i++) {
      data.push({
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
      })
    }
    var t = new Table
    data.forEach(function (product) {
      t.cell('Item ID', product.item_id)
      t.cell('Product Name', product.product_name)
      t.cell('Price', product.price, Table.number(2))
      t.cell('Stock Quantity', product.stock_quantity)
      t.newRow()
    })
    console.log(t.toString())
    exit();
  })
}

function viewInventory() {
  var data = [];
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, res) {
    if (err) throw err;
    console.log("Here are the products with stock quantities less than 5:")
    for (var i = 0; i < res.length; i++) {
      data.push({
        item_id: res[i].item_id,
        product_name: res[i].product_name,
        price: res[i].price,
        stock_quantity: res[i].stock_quantity
      })
    }
    var t = new Table
    data.forEach(function (product) {
      t.cell('Item ID', product.item_id)
      t.cell('Product Name', product.product_name)
      t.cell('Price', product.price, Table.number(2))
      t.cell('Stock Quantity', product.stock_quantity)
      t.newRow()
    })
    console.log(t.toString())
    exit();
  })
}

function addInventory() {
  connection.query("SELECT product_name FROM products", function (err, res) {
    if (err) throw err;
    var products = [];
    for (var i = 0; i < res.length; i++) {
      products.push(res[i].product_name);
    }
    inquirer
      .prompt([{
        type: "list",
        name: "addInventoryTo",
        message: "Which product would you like to add inventory to?",
        choices: products
      }]).then(function (answers) {
        var itemToAddTo = answers.addInventoryTo;
        connection.query("SELECT stock_quantity FROM products WHERE product_name = ?", [itemToAddTo], function (err, res) {
          if (err) throw err;
          quantityOfItem = parseInt(res[0].stock_quantity);
          inquirer
            .prompt([{
              type: "input",
              name: "howMuchInventory",
              message: "There are " + quantityOfItem + " of " + itemToAddTo + ". How much inventory would you like to add?",
              validate: function (value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
            }]).then(function (answers) {
              var amount = parseInt(answers.howMuchInventory) + quantityOfItem;
              connection.query("UPDATE products SET stock_quantity = ? WHERE product_name = ?", [amount, itemToAddTo], function (err, res) {
                if (err) throw err;
                console.log("Updated the inventory.");
                exit();
              })
            })
        })
      })
  })
}

function addProduct() {
  connection.query("SELECT department_name FROM departments", function (err, res) {
    if (err) throw err;
    var departments = [];
    for (var i = 0; i < res.length; i++) {
      departments.push(res[i].department_name);
    }
    inquirer
      .prompt([{
        type: "input",
        name: "newItem",
        message: "Which item would you like to add?"
      }, {
        type: "input",
        name: "newInventory",
        message: "How much of this product would you like to add?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }, {
        type: "list",
        name: "newDepartment",
        message: "Which department is this product in?",
        choices: departments
      }, {
        type: "input",
        name: "newPrice",
        message: "How much does this product cost?",
        validate: function (value) {
          if (isNaN(value) === false) {
            return true;
          }
          return false;
        }
      }]).then(function (answers) {
        var newProduct = {
          product_name: answers.newItem,
          department_name: answers.newDepartment,
          price: parseInt(answers.newPrice),
          stock_quantity: parseInt(answers.newInventory),
          product_sales: 0.00
        }
        connection.query("INSERT INTO products SET ?", newProduct, function (err, res) {
          if (err) throw err;
          console.log("Added new item to products.");
          exit();
        })
      })
  })
}

function exit() {
  inquirer
    .prompt([{
      type: "confirm",
      name: "exit",
      message: "Would you like to exit?"
    }]).then(function (answers) {
      if (answers.exit) {
        connection.end();
      } else {
        start();
      }
    })
}

function start() {
  inquirer
    .prompt([{
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }]).then(function (answers) {
      if (answers.options === "View Products for Sale") {
        viewProducts();
      } else if (answers.options === "View Low Inventory") {
        viewInventory();
      } else if (answers.options === "Add to Inventory") {
        addInventory();
      } else if (answers.options === "Add New Product") {
        addProduct();
      }
    })
}