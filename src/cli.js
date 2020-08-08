const inquirer = require('inquirer');
const Listr = require('listr');

const taskLists = require('./tasks');

inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the project name?',
      name: 'projectname',
    },
    {
      type: 'list',
      message: 'Which framework you want to use?',
      name: 'framework',
      choices: ['Next.js', 'Gatsby'],
    },
    {
      type: 'confirm',
      message: 'Do you want to use Typescript?',
      name: 'typescript',
    },
  ])
  .then(answers => {
    const tasks = new Listr([...taskLists(answers)]);
    tasks.run();
  });
