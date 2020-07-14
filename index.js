const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "employee_db",
    port: 3306
});

connection.connect((err) => {
    if (err) throw err;

    startApp();
});


connection.end();