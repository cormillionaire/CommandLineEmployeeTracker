const initialPrompt = 
[
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'action',
      choices: ['view all departments', 'view all roles', 'view all employees','add a department', 'add a role', 'add an employee', 'update an employee role'],
    },
  ];
  
//

  module.exports = initialPrompt;