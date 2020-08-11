#! /usr/bin/env node

const inquirer = require('inquirer');
const Listr = require('listr');
const yargs = require('yargs');

const taskLists = require('./tasks');

const { argv } = yargs.options({
  authToken: {
    alias: 'auth',
    description: 'Give the CLI your personal authentication token.',
    demandOption: true,
  },
  username: {
    alias: 'user',
    description: 'Give the CLI your username.',
    demandOption: true,
  },
});

inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the project name?',
      name: 'projectname',
    },
    {
      type: 'list',
      message: 'What project are you creating?',
      name: 'framework',
      choices: ['Next.js', 'Gatsby', 'Express.js'],
    },
    {
      type: 'confirm',
      message: 'Do you want to use Typescript?',
      name: 'typescript',
    },
  ])
  .then(answers => {
    const tasks = new Listr([...taskLists(answers, argv)]);
    tasks.run();
  });
