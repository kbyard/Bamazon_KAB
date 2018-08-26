DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
  id INT NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (id),
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price INT default 0,
  stock_quantity INT default 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("One Fish", "Pets", 4, 28),
    ("Two Fish", "Pets", 8, 33),
    ("Red Fish", "Pets", 5, 55),
    ("Blue Fish", "Pets", 9, 19),
    ("Green Eggs", "Grocery", 5, 50),
    ("Ham", "Grocery", 12, 18),
    ("Boat Ride", "Travel", 50, 5),
    ("Goat Ride", "Travel", 5, 50),
    ("Truffula Trees", "Garden", 400, 5),
    ("Thneed", "Clothing", 800, 1);