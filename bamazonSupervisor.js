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
});

function start() {
  inquirer
  .prompt ([{
    type: "list",
    message: "What would you like to do?",
    choices: ["View Product Sales by Department", "Create New Department"]
  }]).then(function(answers) {

})
}