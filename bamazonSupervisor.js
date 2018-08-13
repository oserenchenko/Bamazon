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

function viewProdDep() {
  var data = [];
  console.log("Product sales by department:");
  connection.query("SELECT departments.department_id, ANY_VALUE(departments.department_name) department_name, ANY_VALUE(departments.over_head_costs) over_head_costs, ANY_VALUE(products.product_sales) product_sales FROM departments LEFT JOIN products ON departments.department_name = products.department_name GROUP BY departments.department_id", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      data.push({
        department_id: res[i].department_id,
        department_name: res[i].department_name,
        over_head_costs: res[i].over_head_costs,
        product_sales: res[i].product_sales,
        total_profit: parseFloat(res[i].product_sales) - parseFloat(res[i].over_head_costs)
      })
    }
    var t = new Table
    data.forEach(function (product) {
      t.cell('Department ID', product.department_id)
      t.cell('Department Name', product.department_name)
      t.cell('Over Head Costs', product.over_head_costs, Table.number(2))
      t.cell('Product Sales', product.product_sales)
      t.cell('Total Profit', product.total_profit, Table.number(2))
      t.newRow()
    })
    console.log(t.toString())
    exit();
  })
}

function displayDepTable(func) {
  connection.query("SELECT * FROM departments", function (err, res) {
    if (err) throw err;
    var data = [];
    for (var i = 0; i < res.length; i++) {
      data.push({
        department_id: res[i].department_id,
        department_name: res[i].department_name,
        over_head_costs: res[i].over_head_costs
      })
    }
    var t = new Table
    data.forEach(function (product) {
      t.cell('Department ID', product.department_id)
      t.cell('Department Name', product.department_name)
      t.cell('Over Head Costs', product.over_head_costs, Table.number(2))
      t.newRow()
    })
    console.log(t.toString())
    func();
  })
}

function newDep() {
  inquirer
    .prompt([{
      type: "input",
      name: "newDepName",
      message: "Which department would you like to add?"
    }, {
      type: "input",
      name: "newCost",
      message: "What is the over head cost for this new department?",
      validate: function (value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
    }]).then(function (answers) {
      var newDepartment = {
        department_name: answers.newDepName,
        over_head_costs: parseInt(answers.newCost)
      }
      connection.query("INSERT INTO departments SET ?", newDepartment, function (err, res) {
        if (err) throw err;
        console.log("Added new department to departments.");
        displayDepTable(exit);
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

connection.connect(function (err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId + "\n");
  start();
});

function start() {
  inquirer
    .prompt([{
      type: "list",
      name: "options",
      message: "What would you like to do?",
      choices: ["View Product Sales by Department", "Create New Department"]
    }]).then(function (answers) {
      if (answers.options === "View Product Sales by Department") {
        viewProdDep();
      } else if (answers.options === "Create New Department") {
        displayDepTable(newDep);
      }
    })
}