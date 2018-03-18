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

function readDept(){
   connection.query("SELECT department_name FROM products", function(err, res){
       var array = [];
       for (let i=0; i<res.length; i++){
           if (array.indexOf(res[i].department_name)=== -1){
               array.push(res[i].department_name)
           }
       }
       inquirer.prompt([
           {
               type: "list",
               name: "dept",
               message: "Which department do you want to view?",
               choices: array
           }
       ]).then(function(answer){
        salesByDept(answer.dept)
       })
   })
}

function salesByDept(dept){
    connection.query("SELECT product_sales FROM products WHERE ?", {department_name: dept}, function(err, res){
        var sum = 0;
        for (let i = 0; i<res.length; i++){
            sum += res[i].product_sales
        }
        console.log("total sales for " + dept + " is: $" + sum)
    })
    setTimeout(start, 3000)
}

function start(){
    inquirer.prompt([
        {
            type:"list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View product sales by department", "Create new department"]
        }
    ]).then(function(answer){
        if (answer.choice === "View product sales by department"){
            readDept();
        }
        if (answer.choice === "Create new department"){
            
        }
    })
}