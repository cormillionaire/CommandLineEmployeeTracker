const inquirer = require('inquirer');
const mysql = require('mysql2');
const questions = require('./src/questions.js');


inquirer
  .prompt(questions)
  .then((data) => {
    console.log('Success!')
  });