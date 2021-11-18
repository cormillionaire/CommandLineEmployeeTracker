const inquirer = require("inquirer");

const initialPrompt = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

const newDeptPrompt = [
    {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'newDepartment',
    },
];

const newRolePrompt = [
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'newRoleTitle',
    },
    {
        type: 'number',
        message: 'What is the salary of the role?',
        name: 'newRoleSalary',
    },
    {
        type: 'list',
        message: 'What is the department of the role?',
        name: 'newRoleDept',
        choices: [] ,
    },
];

const newEmployeePrompt = [
    {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName',
    },
    {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastName',
    },
    {
        type: 'list',
        message: "What is the employee's role?",
        name: 'employeeRole',
        choices: [] ,
    },
    {
        type: 'list',
        message: "What is the employee's manager?",
        name: 'employeeManager',
        choices: [] ,
    },
];

const updateEmployeePrompt = [
    {
        type: 'list',
        message: 'Who would you like to update?',
        name: 'employeeList',
        choices: [],
    },
    {
        type: 'list',
        message: "Which role do you want to assign the selected employee?",
        name: 'employeeRole',
        choice: [] ,
    },
];

module.exports = { initialPrompt, newDeptPrompt, newRolePrompt, newEmployeePrompt, updateEmployeePrompt };