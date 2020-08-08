const path = require('path');

const execa = require('execa');
const chalk = require('chalk');

const waitASecond = require('./utils/timeouts');
const files = require('./utils/helpers');
const { repos } = require('./constants');

const {
  exists,
  getCurrentDirectory,
  createNewDirectory,
  changeToNewDirectory,
} = files;

const repo = answers => {
  if (answers.framework === 'Next.js') {
    return repos.nextjs;
  }
  if (answers.framework === 'Next.js' && answers.typescript === true) {
    return repos.nextjsTypescript;
  }
  if (answers.framework === 'Gatsby') {
    return repos.gatsby;
  }
  if (answers.framework === 'Gatsby' && answers.typescript === true) {
    return repos.gatsby;
  }
};

const taskLists = answers => {
  const projectName = answers.projectname;
  const projectPath = path.join(getCurrentDirectory, projectName);

  const createLocalProject = [
    {
      title: `Creating project directory for ${projectName}`,
      task: async () => {
        await waitASecond();
        createNewDirectory(projectPath).catch(() => {
          if (exists(projectPath)) {
            console.error(
              chalk.red(
                `Folder ${projectPath} exists. Delete or use another name.`
              )
            );
          }
          process.exit(1);
        });
      },
    },

    {
      title: `Opening up project directory`,
      task: async () => {
        await waitASecond();
        changeToNewDirectory(projectPath).catch(err => err.message);
      },
    },
    {
      title: `Cloning repo into ${projectName} directory`,
      task: async () => {
        const { stdout } = await execa('git', [
          'clone',
          '--depth=1',
          repo(answers),
          projectPath,
        ]);
        stdout;
      },
    },
    {
      title: `Removing .git folder`,
      task: async () => {
        const { stdout } = await execa('rm', ['-rf', `${projectPath}/.git`]);
        stdout;
      },
    },
  ];

  const createGitRepository = [
    {
      title: `Initializing git repository`,
      task: async () => {
        await waitASecond();
        const { stdout } = await execa('git', ['init']);
        stdout;
      },
    },
  ];

  const installLocalDependencies = [
    {
      title: `Installing Dependencies with Yarn`,
      task: async (ctx, task) => {
        await waitASecond();
        await execa('yarn').catch(() => {
          ctx.yarn = false;
          task.skip('Yarn not available, install it via `npm install -g yarn`');
        });
      },
    },
    {
      title: 'Install package dependencies with npm',
      enabled: ctx => ctx.yarn === false,
      task: () => execa('npm', ['install']),
    },
    {
      title: `Opening Project`,
      task: async () => {
        await waitASecond();
        await execa('code', ['.']);
      },
    },
  ];

  return [
    ...createLocalProject,
    ...createGitRepository,
    // ...installLocalDependencies,
  ];
};

module.exports = taskLists;
