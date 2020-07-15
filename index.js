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
            "- View Departments",
            "- View Roles",
            "- View All Employees",
            "- View Employees by Department",
            "- View Employees by Role",
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
                case "- View Departments":
                    viewDepts();
                    break;
                case "- View Roles":
                    viewRoles();
                    break;
                case "- View All Employees":
                    viewEmployees();
                    break;
                case "- View Employees by Department":
                    viewByDepartm();
                    break;
                case "- View Employees by Role":
                    viewByRole();
                    break;
                case "- Add Employee":
                    addEmployee();
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
};

// Function to view  Departments
function viewDepts() {
    connection.query("SELECT * from department", (err, results) => {
        if (err) throw err;
        console.table(results);
        start();

    })
};

// Function to view Roless
function viewRoles() {
    connection.query("SELECT roles.title, roles.salary, department.name FROM roles LEFT JOIN department ON roles.department_id = department.id",
        (err, results) => {
            if (err) throw err;
            console.table(results)
            start();

        })
};

// Function to view all Employees
function viewEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager, roles.title, department.name FROM roles RIGHT JOIN employee ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
        (err, results) => {
            if (err) throw err;
            console.table(results);
            start();

        })
};

// function to view employees by department
function viewByDepartm() {
    inquirer.prompt({
        name: "departments",
        type: "list",
        message: "Employees from which department do you want to see?",
        choices: [
            "Sales",
            "Finance",
            "Legal",
            "Engineering"
        ]
    })
        .then(answers => {
            connection.query("SELECT employee.first_name, employee.last_name, roles.title, department.name FROM roles RIGHT JOIN employee ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id WHERE department.name = ?", [answers.departments],
                (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    start();
                })
        })
};

// function to view employees by role
function viewByRole() {
    inquirer.prompt({
        name: "roles",
        type: "list",
        message: "Employees with what Role do you want to see?",
        choices: [
            "Sales Lead",
            "Salesperson",
            "Accountant",
            "Legal Team Lead",
            "Lawyer",
            "Lead Engineer",
            "Software Engineer"
        ]
    })
        .then(answers => {
            connection.query("SELECT employee.first_name, employee.last_name, roles.title, department.name FROM roles RIGHT JOIN employee ON employee.roles_id = roles.id LEFT JOIN department ON roles.department_id = department.id WHERE roles.title = ?", [answers.roles],
                (err, results) => {
                    if (err) throw err;
                    console.table(results);
                    start();
                })
        })
};

// function to add an employee
function addEmployee() {
    connection.query("SELECT title FROM roles", (err, results) => {
        if (err) throw err;
        let rolesArray = [];
        for (i = 0; i < results.length; i++) {
            rolesArray.push(results[i].title);
        }
        inquirer.prompt([
            {
                name: "firstName",
                type: "input",
                message: "What is the eployee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the eployee's last name?"
            },
            {
                name: "newRole",
                type: "rawlist",
                message: "Choose the new employee's role:",
                choices: rolesArray
            },

        ])
    },
    )
}