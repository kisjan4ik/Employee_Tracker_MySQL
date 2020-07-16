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
    connection.query("SELECT title,id FROM roles", (err, results) => {
        if (err) throw err;
        let rolesArray = [];
        for (i = 0; i < results.length; i++) {
            rolesArray.push({ "title": results[i].title, "id": results[i].id });
        }
        connection.query("SELECT first_name, last_name,id FROM employee",
            (err, results1) => {
                if (err) throw err;
                let managerArr = [];
                for (j = 0; j < results1.length; j++) {
                    let firstName = results1[j].first_name;
                    let lastName = results1[j].last_name;
                    managerArr.push({ 'name': firstName + " " + lastName, 'id': results1[j].id });
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
                        choices: rolesArray.map(role => role.title)
                    },
                    {
                        name: "newManager",
                        type: "rawlist",
                        message: "Choose the new employee's manager:",
                        choices: managerArr.map(manager => manager.name)
                    }

                ])

                    .then(answer => {
                        const managerId = managerArr.filter(manager => manager.name === answer.newManager);
                        const roleId = rolesArray.filter(role => role.title === answer.newRole);

                        connection.query("INSERT INTO employee SET ?",
                            {
                                first_name: answer.firstName,
                                last_name: answer.lastName,
                                role_id: roleId[0].id,
                                manager_id: managerId[0].id
                            },

                            (err, results) => {
                                if (err) throw err;
                                console.log(`New employee:  ${answer.firstName}, ${answer.lastName}, ${answer.newRole}, ${answer.newManager} added.`);
                                start();
                            })
                    })
            })
    })

}

// function to add a new Role
function addRole() {
    connection.query("SELECT name,id FROM department", (err, results) => {
        if (err) throw err;
        let departmentArray = [];
        for (i = 0; i < results.length; i++) {
            departmentArray.push({ "name": results[i].name, "id": results[i].id });
        }

        inquirer.prompt([
            {
                name: "newRoleName",
                type: "input",
                message: "What is the name of the new Role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is salary for the new role (annual)?"
            },
            {
                name: "roleDept",
                type: "rawlist",
                message: "Choose the Department for the New role:",
                choices: departmentArray.map(department => department.name)
            },
        ])

            .then(answer => {
                const departmentId = departmentArray.filter(department => department.name === answer.roleDept);

                connection.query("INSERT INTO roles SET ?",
                    {
                        title: answer.newRoleName,
                        salary: answer.salary,
                        department_id: departmentId[0].id
                    },

                    (err, results) => {
                        if (err) throw err;
                        console.log(`New role:  ${answer.newRoleName}, with salary of $ ${answer.salary}, added to the ${answer.roleDept}, department`);
                        start();
                    })
            })
    })
}