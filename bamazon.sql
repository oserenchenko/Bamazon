DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
product_name VARCHAR(100) NOT NULL,
dapartment_name VARCHAR(100),
price DECIMAL(50,2),
stock_quantity INTEGER(50)
);