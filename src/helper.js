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
const mainMenu = () => {
    inquirer.prompt(initialPrompt)
        .then((data) => {
            console.log(data);
            switch (data.action) {
                case 'View all departments':
                    await getAllDepartments();
                    break;
                case 'View all roles':
                    getAllRoles();
                    break;
                case 'View all employees':
                    getAllEmployees();
                    break;
                case 'Add a department':
                    addDepartment();
                    break;
                case 'Add a role':
                    addRole();
                    break;
                case 'Add an employee':
                    addEmployee();
                    break;
                case 'Update an employee role':
                    break;
                default:
                    console.log('Invalid Choice.Choose Valid Choice.');
                    break;
            };
        }
    );
}

//view all departments
const getAllDepartments = async () => {
    const tableName = 'department';
    const query = util.promisify(db.query).bind(db);
    const results = await query('SELECT * FROM ??', [tableName]);
    console.table(results);
    mainMenu();
    //   });
}
//view all roles
const getAllRoles = () => {
    const tableName = 'role';
    db.query('SELECT * FROM ??',[tableName] ,function (err, results) {
        console.table(results);
        mainMenu();
      });
}
//view all employees query
const getAllEmployees = () => {
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
          `, [tableName,joinDataTable1,joinDataTable2,tableName],
          function (err, results) {
        console.table(results);
        mainMenu();
      });
}

const getAllEmployeesNames = () => {
    const tableName = 'employee';
    db.query(`
        SELECT CONCAT(CONCAT(employee.first_name,)employee.last_name)
        FROM ??
          `, [tableName],
          function (err, results) {
        console.table(results);
      });
}

//get managers
const getManagers = () => {
    const tableName = 'employee';
    const managerRoleId = '1'
    db.query('SELECT * FROM ?? WHERE role_id = ?', [tableName,managerRoleId], function (err, results) {
        console.table(results);
      });
}
//add a department
const addDepartment = (newDepartment) => {
    const tableName = 'department';
    db.query('INSERT INTO ?? (name) VALUES (?)', [tableName,newDepartment], function (err, results) {
        console.log(results);
        mainMenu();
      });
}
//add a role
const addRole = (newRoleTitle,newRoleSalary,newRoleDept) => {
    const tableName = 'role';
    db.query('INSERT INTO ?? (title, salary, department_id) VALUES (?,?,?)', [tableName,newRoleTitle,newRoleSalary,newRoleDept], function (err, results) {
        console.log(results);
        mainMenu();
      });
}
//add an employee
const addEmployee = (newEmpFirstName,newEmpLastName,newEmpRole,newEmpManager) => {
    const tableName = 'employee';
    db.query('INSERT INTO ?? (first_name, last_name, role_id, manager_id) VALUES (?,?,?)', [tableName,newEmpFirstName,newEmpLastName,newEmpRole,newEmpManager], function (err, results) {
        console.log(results);
        mainMenu();
      });
}
const updateEmployee = () => {
    mainMenu();
}

//update an employee role
module.exports = {mainMenu,getAllDepartments,getAllRoles,getAllEmployees,addDepartment, addRole, addEmployee, getManagers};