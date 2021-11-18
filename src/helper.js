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
                        .then((results) => {
                            console.table(results);
                            mainMenu()
                        }
                        );
                    break;
                case 'View all employees':
                    getAllEmployees()
                        .then((results) => {
                            console.table(results);
                            mainMenu()
                        }
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
                        .then((newEmpFirstName) => {
                            console.log(newEmpFirstName + " added as new employee");
                            mainMenu()
                        });
                    break;
                case 'Update an employee role':
                    updateEmployeeRole()
                        .then((updateEmpFirstName) => {
                            console.log(updateEmpFirstName + " role was updated");
                            mainMenu()
                        });
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
                resolve(results);
            });
    });
}

const getAllEmployeesNames = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'employee';
        db.query(`SELECT employee.id,CONCAT(CONCAT(employee.first_name, " "),employee.last_name) as employee_name FROM ??`, tableName, function (err, results) {
            if (err) {
                reject(err);
            }
            resolve(results);
        });
    });
}

//get managers
const getAllManagers = async () => {
    return new Promise((resolve, reject) => {
        const tableName = 'employee';
        const managerRoleId = '1';
        db.query('SELECT * FROM ?? WHERE role_id = 1', [tableName, managerRoleId], function (err, results) {
            if (err) {
                reject(err);
            }
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
const addEmployee = async () => {
    return new Promise((resolve, reject) => {
        newEmployeePrompt[2].choices = [];
        new Promise((resolve, reject) => {
            getAllRoles()
                .then((dataEmpRole) => {
                    dataEmpRole.forEach(role => {
                        newEmployeePrompt[2].choices.push(role.title);
                    });
                    resolve(dataEmpRole);
                });
        }).then((dataEmpRole) => {
            newEmployeePrompt[3].choices = ['None'];
            getAllManagers()
                .then((dataEmpManager) => {
                    dataEmpManager.forEach(employee => {
                        newEmployeePrompt[3].choices.push(employee.first_name + " " + employee.last_name);
                    });
                    inquirer.prompt(newEmployeePrompt)
                        .then((dataEmp) => {
                            const tableName = 'employee';
                            const newEmpFirstName = dataEmp.firstName;
                            const newEmpLastName = dataEmp.lastName;
                            const newEmpRoleName = dataEmp.employeeRole;
                            const newEmpManagerName = dataEmp.employeeManager;
                            let newEmpManager = "";
                            let newEmpRole = "";
                            dataEmpManager.forEach(employee => {
                                if (employee.first_name + " " + employee.last_name === newEmpManagerName) {
                                    newEmpManager = employee.id;
                                } else if (newEmpManagerName === "None"){
                                    newEmpManager = null;
                                }
                            });
                            dataEmpRole.forEach(role => {
                                if (role.title === newEmpRoleName) {
                                    newEmpRole = role.id;
                                }
                            });
                            db.query('INSERT INTO ?? (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)', [tableName, newEmpFirstName, newEmpLastName, newEmpRole, newEmpManager], function (err, results) {
                                if (err) {
                                    reject(err);
                                }
                                console.log("im before resolve");
                                resolve(newEmpFirstName);

                            });
                        });
                });
        });
    });
}

const updateEmployeeRole = async () => {
    return new Promise((resolve, reject) => {
        updateEmployeePrompt[0].choices = [];
        new Promise((resolve, reject) => {
            getAllEmployeesNames()
                .then((dataEmpName) => {
                    dataEmpName.forEach(employee => {
                        updateEmployeePrompt[0].choices.push(employee.employee_name);
                        resolve(dataEmpName);
                    });
                })
        }).then((dataEmpName) => {
            updateEmployeePrompt[1].choices = [];
            new Promise((resolve, reject) => {
            getAllRoles()
                .then((dataEmpRole) => {
                    dataEmpRole.forEach(role => {
                        updateEmployeePrompt[1].choices.push(role.title);
                        resolve(dataEmpRole);
                    });
                });
            }).then ((dataEmpRole) => {
            inquirer.prompt(updateEmployeePrompt)
                .then((dataUpdateEmp) => {
                    const tableName = 'employee';
                    const updateEmpRoleName = dataUpdateEmp.employeeRole;
                    let employeeId = "";
                    dataEmpName.forEach(employee => {
                        if (employee.employee_name === dataUpdateEmp.employeeList) {
                            employeeId = employee.id;
                        }
                    });
                    dataEmpRole.forEach(role => {
                        if (role.title === dataUpdateEmp.employeeRole) {
                            roleId = role.id;
                        }
                    });
                    db.query('UPDATE ?? SET role_id = ? WHERE id = ?', [tableName, roleId, employeeId], function (err, results) {
                        if (err) {
                            reject(err);
                        }
                        console.log("Im before resolve");
                        console.log(dataUpdateEmp.employeeList);
                        resolve(dataUpdateEmp.employeeList);
                    });
                });
            });
        });
    });
}

//update an employee role
module.exports = { mainMenu, getAllDepartments, getAllRoles, getAllEmployees, addDepartment, addRole, addEmployee, getAllManagers, getAllEmployeesNames, updateEmployeeRole };