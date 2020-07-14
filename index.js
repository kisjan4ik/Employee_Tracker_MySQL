const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "company_db",
    port: 3306
});

// connect to the mysql database
connection.connect((err) => {
    if (err) throw err;
    // run the start function after connection is made
    start();
});

// promting user to choose:
function start() {
    inquirer.prompt({
        name: "options",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "- Viev All Employees",
            "- Viev All Employees by Department",
            "- Viev All Employees by Role",
            "- Add Employee",
            "- Add Role",
            "- Add Department",
            "- Update Employee Role",
            "- Exit"
        ]

    })
        .then(answers => {
            // Create code that creates a new employee object based off the employee class and pushes it to the teamArray.
            switch (answers.options) {
                case "- Viev All Employees":
                    viewEmployees();
                    break;
                case "- Viev All Employees by Department":
                    viewByDepartm();
                    break;
                case "- Viev All Employees by Role":
                    viewByRole();
                    break;
                case "- Add Employee":
                    addEmployes();
                    break;
                case "- Add Role":
                    addRole();
                    break;
                case "- Add Department":
                    addDept();
                    break;
                case "- Update Employee Role":
                    updateRole();
                    break;
                case "- Exit":
                    connection.end();
                    break;
            };
        })
}

// Function to view all Employees
function viewEmployees() {
connection.query("SELECT * from employee", (err, results) => {
    if (err) throw err;
    console.table(results);
    start();
})
}
