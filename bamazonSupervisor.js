var mysql = require("mysql");
var inquirer = require("inquirer")
var cTable = require('console.table');

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
    connection.query("SELECT departments.department_name, departments.id, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON products.department_name = departments.department_name", function(err, res){
        console.log(res)
        var array = [];
        for (let i = 0; i <res.length; i++){
            if (res[i].department_name === dept){
                array.push(res[i])
            }
        }
        var sum = 0;
        for (let i = 0; i<array.length; i++){
            sum += array[i].product_sales;
        }
        var profit = sum - array[0].over_head_costs
        console.table([
            {
                department_id: array[0].id,
                department_name: array[0].department_name,
                over_head_costs: array[0].over_head_costs,
                product_sales: sum,
                total_profit: profit
            }
        ])
    })
  
        var sum = 0;
        for (let i = 0; i<res.length; i++){
            sum += res[i].product_sales
        }  
    setTimeout(start, 5000)
}

function newDept(name, cost){
    inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the name of the department?"
        },
        {
            type: "input",
            name: "cost",
            message:"What is the overhead of this department?"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO departments SET ?", {department_name: answer.name, over_head_costs: answer.cost}, function(err, res){
            console.log("department added")
            setTimeout(start, 3000)
        })
    })
    
    
}

function start(){
    inquirer.prompt([
        {
            type:"list",
            name: "choice",
            message: "What would you like to do?",
            choices: ["View product sales by department", "Create new department"]
        },

    ]).then(function(answer){
        if (answer.choice === "View product sales by department"){
            readDept();
        }
        if (answer.choice === "Create new department"){
            newDept();
        }
    })
}