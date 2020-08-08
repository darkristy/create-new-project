const inquirer = require('inquirer');

const createLocalProject = require('./modules/createLocalProject');
const installLocalDependencies = require('./modules/installLocalDependencies');

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
  .then(answers => createLocalProject(answers));
