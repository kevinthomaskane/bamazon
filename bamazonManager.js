
var mysql = require("mysql");
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",

    password: "",
    database: "bamazon"
});

start();

function display(){
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

    })
    start();
}


function getItems(callback){
    connection.query("SELECT product_name FROM products", function(err, res){
        callback(res);
        
    })
}

function lowInventory(){
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res){
        for (let i = 0; i < res.length; i++) {
            console.log("only " + res[i].stock_quantity + " left for " + res[i].product_name )
        }
    })
    start();
}

function addInventory(num, id){
    connection.query("UPDATE products SET stock_quantity = stock_quantity + ? WHERE ?", [num, {item_id: id}], function(err, res){
        console.log("quantity updated")
    })
    start();
}

function addProduct(name, department, price, quantity){
    connection.query("INSERT INTO products SET ?", {product_name: name, department_name: department, price: price, stock_quantity: quantity}, function(err, res){
        console.log("item added")
    })
    start();
}
function start(){
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Choose an option",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function(answer){
        if (answer.options === "View Products for Sale"){
            display();
        }

        if (answer.options === "View Low Inventory"){
            lowInventory();

        }
        if (answer.options === "Add to Inventory"){
            getItems(function(data){
                var arrayOfItems = [];
                for (let i = 0; i < data.length; i++){
                    if (arrayOfItems.indexOf(data[i].product_name)=== -1){
                    arrayOfItems.push(data[i].product_name)
                    }
                }
                inquirer.prompt([
                    {
                        type: "list",
                        name: "products",
                        message: "which item do you want to stock?",
                        choices: arrayOfItems
                    },
                    {
                        type: "input",
                        name: "quantity",
                        message: "How many do you want to stock?"
                    }
                ]).then(function(answer){
                    var id = arrayOfItems.indexOf(answer.products)+1
                    addInventory(answer.quantity, id);
                })
            });
            
            
        }
        if (answer.options === "Add New Product"){
            inquirer.prompt([
                {
                    type: "input",
                    name: "name",
                    message: "What is the name of the product?"
                },
                {
                    type: "input",
                    name: "department",
                    message: "What is the name of the department?"
                },
                {
                    type: "input",
                    name: "price",
                    message: "What is the price of the product?"
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many do you want to stock?"
                },
            ]).then(function(answer){
                addProduct(answer.name, answer.department, answer.price, answer.quantity);
            })
        }
    })
}
