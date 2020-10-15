#! /usr/bin/env node

const inquirer = require('inquirer');
const Listr = require('listr');
const yargs = require('yargs');

const taskLists = require('./tasks');

const { argv } = yargs.options({
  status: {
    alias: 's',
    description: 'Give the CLI the visibility status of your project.',
    demandOption: true,
  },
  terminal: {
    alias: 't',
    description:
      'Specify what terminal your using if vim is your main editor, if using alacritty ignore.',
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
    {
      type: 'list',
      message: 'What editor are you using?',
      name: 'editor',
      choices: ['vscode', 'vim'],
    },
  ])
  .then(answers => {
    const tasks = new Listr([...taskLists(answers, argv)]);
    tasks.run();
  });
