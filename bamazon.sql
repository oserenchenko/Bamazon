DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
product_name VARCHAR(100) NOT NULL,
department_name VARCHAR(100),
price DECIMAL(50,2),
stock_quantity INTEGER(50)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Samsung TV", "Electronics", 739.99, 5), ("Panasonic Headphones", "Electronics", 25.65, 20), ("Floor Lamp", "Furniture", 45.99, 15), ("Leather Purse", "Accessories", 30.25, 50), ("Levi Jeans", "Clothing", 44.99, 32), ("Nike Tennis Shoes", "Shoes", 50.75, 18), ("Mint Tea", "Produce", 26.99, 50), ("Pantene Shampoo", "Toiletries", 12.94, 54), ("Calculus Textbook", "Books", 88.98, 12), ("Bicycle", "Sports", 85.99, 6);

SELECT * FROM products;

CREATE TABLE departments (
department_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
department_name VARCHAR(100) NOT NULL,
over_head_costs DECIMAL(50,2)
);

ALTER TABLE products
ADD product_sales DECIMAL(50,2) NOT NULL;