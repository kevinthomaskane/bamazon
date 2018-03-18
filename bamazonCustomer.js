var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

presentItems();
function presentItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("                      ")
        console.log("WELCOME TO BAMAZON VIRTUAL MARKETPLACE")
        console.log("                      ")
        for (let i = 0; i < res.length; i++) {
            console.log("item available : " + res[i].product_name)
            console.log("item id : " + res[i].item_id)
            console.log("department : " + res[i].department_name)
            console.log("item price : " + res[i].price)
            console.log("number of items available : " + res[i].stock_quantity)
            console.log("----------------------")
            console.log("                      ")
        }
        start();

    })
}


function read(id, funky) {
    connection.query("SELECT * FROM products WHERE ?", { item_id: id }, function (err, res) {
        funky(res);
    })
}

function updateQuantity(num, id) {
    connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?", [num, { item_id: id }], function (err, res) {
        console.log("quantity updated")
    })
}

function totalCost(num, id) {
    connection.query("SELECT price FROM products WHERE ?", { item_id: id }, function (err, res) {
        console.log("your total price is: $" + (res[0].price * num))
    })
}


function start() {
    inquirer.prompt([
        {
            type: "input",
            name: "id",
            message: "What is the id of the product you would like to buy?"
        },
        {
            type: "input",
            name: "number",
            message: "How many would you like to buy?"
        }
    ]).then(function (answer) {
        console.log(answer.id)
        read(answer.id, function (data) {
            if (answer.number > data[0].stock_quantity) {
                console.log("sorry, insufficient quantity")
                setTimeout(presentItems, 2000);

            }
            else {
                updateQuantity(answer.number, answer.id);
                totalCost(answer.number, answer.id);
                setTimeout(presentItems, 3000);
            }
        });

    })
}