## Bamazon
Bamazon is an online store, command line interface application that has three views:
  1. Customer: The customer is able to view all of the products for sale and choose which they would like to purchase and how many units.
  
  2. Manager: The manager can complete four tasks:
    * View all of the products for sale.
    * View the products that have low inventory (less than 5).
    * Add inventory to the product of their choosing.
    * Add a new product.
    
  3. Supervisor: The supervisor complete two tasks:
    * View product sales by department: they can see how much money each department is bringing in based on product sales minus over head costs.
    * Add a new department.

______________
______________
______________

![homepage]()

## View full video walkthroughs or screenshots of the CLI app:
Video Walk-Throughs: 
  * Customer View: /Videos/customerView.mov
  * Manager View: /Videos/managerView.mov
  * Supervisor View: /Videos/supervisorView.mov
Screenshots:
  */Screenshots

______________
______________
______________

## Getting Started
to test locally, run this command in your terminal
```
git clone https://github.com/oserenchenko/Bamazon.git
```
once inside the Bamazon folder, run
```
npm install
```
then, run the view you wish to see (either Customer, Manager, or Supervisor js files)
```
node bamazonCustomer.js
```


## Built With
* [Javascript](https://www.javascript.com/) - website logic
* [MySQL](https://www.mysql.com/) - database
* [Node.js](https://nodejs.org/en/) - JS runtime
* [Inquirer](https://www.npmjs.com/package/inquirer/v/0.2.3) - npm dependency for prompting user
* [Easy-Table](https://www.npmjs.com/package/easy-table) - npm dependency for displaying results in a table in the command line

______________
______________
______________
## Authors
* [Olga Serenchenko](https://github.com/oserenchenko)

______________
______________
______________
## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
