const mysql = require('mysql2');
const util = require('util');
const inquirer = require('inquirer');
const { initialPrompt, newDeptPrompt, newRolePrompt, newEmployeePrompt, updateEmployeePrompt } = require('./questions.js');


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'g3tInTh3DB',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

//main menu prompt
const mainMenu = async () => {
    inquirer.prompt(initialPrompt)
        .then((data) => {

            const action = data.action;
            console.log(action);
            switch (action) {
                case 'View all departments':
                    getAllDepartments()
                        .then((results) => {
                            console.table(results);
                            mainMenu();
                        }
                        );
                    break;
                case 'View all roles':
                    getAllRoles()
                        .then(() =>
                            mainMenu()
                        );
                    break;
                case 'View all employees':
                    getAllEmployees()
                        .then(() =>
                            mainMenu()
                        );
                    break;
                case 'Add a department':
                    addDepartment()
                        .then(() =>
                            mainMenu()
                        );
                    break;
                case 'Add a role':
                    addRole()
                        .then((newRoleTitle) => {
                            console.log(newRoleTitle + " added as new role");
                            mainMenu();
                        });
                    break;
                case 'Add an employee':
                    addEmployee()
                        .then(() =>
                            mainMenu()
                        );
                    break;
                case 'Update an employee role':
                    updateEmployeeRole()
                        .then(() =>
                            mainMenu()
                        );
                    break;
                default:
                    console.log('Invalid Choice.Choose Valid Choice.');
                    mainMenu();
                    break;
            };
        }
        );
}

//view all departments
const getAllDepartments = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'department';
        db.query('SELECT * FROM ??', tableName, (err, results) => {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}


//view all roles
const getAllRoles = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'role';
        db.query('SELECT * FROM ??', tableName, (err, results) => {
            if (err) {
                reject(err);
            }
            console.table(results);
            resolve(results);
        });
    });
}
//view all employees query
const getAllEmployees = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'employee';
        const joinDataTable1 = 'role';
        const joinDataTable2 = 'department';
        db.query(`
        SELECT employee.first_name,employee.last_name,role.title,department.name,role.salary,CONCAT(CONCAT(emp.first_name, " "),emp.last_name) AS manager_name 
        FROM ?? JOIN ?? ON employee.role_id = role.id
        JOIN ??
          ON role.department_id = department.id
        LEFT JOIN ?? AS emp 
          ON emp.id = employee.manager_id
          `, [tableName, joinDataTable1, joinDataTable2, tableName],
            function (err, results) {
                if (err) {
                    reject(err);
                }
                console.table(results);
                resolve(results);
            });
    });
}

const getAllEmployeesNames = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'employee';
        db.query(`SELECT CONCAT(CONCAT(employee.first_name,)employee.last_name) FROM ??`, tableName, function (err, results) {
            if (err) {
                reject(err);
            }
            console.table(results);
            resolve(results);
        });
    });
}

//get managers
const getManagers = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'employee';
        const managerRoleId = '1';
        db.query('SELECT * FROM ?? WHERE role_id = ?', [tableName, managerRoleId], function (err, results) {
            if (err) {
                reject(err);
            }
            console.table(results);
            resolve(results);
        });
    });
}

//add a department
const addDepartment = async () => {
    return new Promise((resolve, reject) => {
        inquirer.prompt(newDeptPrompt)
            .then((data) => {
                console.log(data)
                const tableName = 'department';
                const newDepartmentInfo = data.newDepartment;
                db.query('INSERT INTO ?? (name) VALUES (?)', [tableName, newDepartmentInfo], function (err, results) {
                    if (err) {
                        reject(err);
                    }
                    console.log("Added " + data.newDepartment + " as new department");
                    resolve(results);
                });
            })
    });
};
//add a role
const addRole = async () => {
    return new Promise((resolve, reject) => {
        newRolePrompt[2].choices = [];
        getAllDepartments()
            .then((dataDep) => {
                dataDep.forEach(department => {
                    newRolePrompt[2].choices.push(department.name)
                });
                console.log("new log" + newRolePrompt[2].choices)
                inquirer.prompt(newRolePrompt)
                    .then((dataRole) => {
                        const tableName = 'role';
                        const newRoleTitle = dataRole.newRoleTitle;
                        const newRoleSalary = dataRole.newRoleSalary;
                        const newRoleDeptName = dataRole.newRoleDept;
                        let newRoleDept = "";
                        dataDep.forEach(department => {
                            if (department.name === newRoleDeptName) {
                                newRoleDept = department.id;
                            }
                        });
                        db.query('INSERT INTO ?? (title, salary, department_id) VALUES (?,?,?)', [tableName, newRoleTitle, newRoleSalary, newRoleDept], function (err, results) {
                            if (err) {
                                reject(err);
                            }
                            resolve(newRoleTitle);
                        });
                    })
            });
    });
}
//add an employee
const addEmployee = () => {
    newEmployeePrompt[2].choice = getAllRoles();
    inquirer.prompt(newEmployeePrompt)
        .then((data) => {
            const tableName = 'employee';
            const newEmpFirstName = data.firstName;
            const newEmpLastName = data.lastName;
            const newEmpRole = data.employeeRole;
            const newEmpManager = data.employeeManager;
            db.query('INSERT INTO ?? (first_name, last_name, role_id, manager_id) VALUES (?,?,?)', [tableName, newEmpFirstName, newEmpLastName, newEmpRole, newEmpManager], function (err, results) {
                console.log(results);
            });
        })
}

const updateEmployeeRole = () => {
    inquirer.prompt(updateEmployeePrompt)
        .then((data) => {
            const tableName = 'employee';
            const updateEmpRole = data.employeeRole;
            //get role id from role name

            //insert change into table
            db.query('INSERT INTO ?? (role_id) VALUES (?)', [tableName,], function (err, results) {
                console.log(results);
            });
        })
}

//update an employee role
module.exports = { mainMenu, getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, getManagers, getAllEmployeesNames, updateEmployeeRole };