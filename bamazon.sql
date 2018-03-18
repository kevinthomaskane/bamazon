CREATE DATABASE bamazon;
USE bamazon;

DROP TABLE products;

CREATE TABLE products (
item_id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR (250),
department_name VARCHAR (250),
price DECIMAL (8,2),
stock_quantity INTEGER,
product_sales INTEGER DEFAULT 0,
PRIMARY KEY(item_id)
 
);

CREATE TABLE departments (
id INTEGER AUTO_INCREMENT NOT NULL,
department_name VARCHAR(250),
over_head_costs INTEGER,
PRIMARY KEY (id)
)

 