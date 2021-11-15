const inquirer = require('inquirer');
const mysql = require('mysql2');
const { mainMenu, addDepartment, addRole, addEmployee, getAllDepartments, getAllRoles, getAllEmployees } = require('./src/helper.js');

mainMenu();