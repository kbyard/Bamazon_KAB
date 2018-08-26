// Make sure you save and require the MySQL and Inquirer npm packages.
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});

// Running this application will first display all of the items available for sale.
function start() {
    // Include the ids, names, and prices of products for sale.
    connection.query("SELECT id, product_name, price, stock_quantity FROM products", function(err, res) {
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Price', 'Units In Stock'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product_name, res[i].price, res[i].stock_quantity]);
        }

        console.log(table.toString());
        // The app should then prompt users with two messages.
        inquirer.prompt([
            // The first should ask them the ID of the product they would like to buy.
            {
                name: "id",
                type: "input",
                message: "Please enter the Product ID of the item you would like to purchase: ",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            // The second message should ask how many units of the product they would like to buy.
            {
                name: "units",
                type: "input",
                message: "How many units of this product would you like to purchase?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            var chosenItem;
            for (var i = 0; i < res.length; i++) {
                if (res[i].id === parseInt(answer.id)) {
                    chosenItem = res[i];
                    checkStock(parseInt(answer.id),answer.units);
                }
            }
        })
    });
}

// Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
function checkStock(itemID, units) {
    connection.query("SELECT * FROM products WHERE ?",
        {
            id: itemID
        },
        function (err, res) {
            if (err) throw err;
            // If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
            if (res[0].stock_quantity < units) {
                console.log("Insufficient quantity!");
                start();
            }
            else {
                updateQuantity(itemID, units);
            }
        }
    );
}

// However, if your store does have enough of the product, you should fulfill the customer's order.
function updateQuantity(itemID, units) {
    // This means updating the SQL database to reflect the remaining quantity.
    connection.query("SELECT * FROM products WHERE ?",
        {
            id: itemID
        },
        function (err, res) {
            if (err) throw err;
            var newQuantity = res[0].stock_quantity - units;
            if (newQuantity < 0)
            newQuantity = 0;

            connection.query("UPDATE products SET ? WHERE ?", [
                {
                    stock_quantity: newQuantity
                },
                {
                    id: itemID
                }
            ],
            function (err, res) { });
            cost(itemID, units);
        }
    );
}

// Once the update goes through, show the customer the total cost of their purchase.
function cost(itemID, units) {
    connection.query("SELECT * FROM products WHERE ?",
        {
            id: itemID
        },
        function (err, res) {
            if (err) throw err;
            var totalCost = res[0].price * units;
            console.log("Total cost is $ " + totalCost);
            restart();
        }
    );
}

function restart() {
    inquirer.prompt({
        name: "shopOrExit",
        type: "rawlist",
        message: "Would you like to [Shop] or [EXIT]?",
        choices: ["SHOP", "EXIT"]
    })
    .then(function(answer) {
        if (answer.shopOrExit.toUpperCase() === "SHOP") {
            start();
        }
        else {
            connection.end();
        }
    });
}