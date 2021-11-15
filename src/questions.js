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
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

const newRolePrompt = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

const newEmployeePrompt = [
    {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role'],
    },
];

const updateEmployeePrompt = [
    {
        type: 'list',
        message: 'Who would you like to update?',
        name: 'employee',
        choices: [],
    },
];

module.exports = { initialPrompt, newDeptPrompt, newRolePrompt, newEmployeePrompt, updateEmployeePrompt };