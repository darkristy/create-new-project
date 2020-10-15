const path = require('path');

const execa = require('execa');
const chalk = require('chalk');

const waitASecond = require('./utils/timeouts');
const files = require('./utils/helpers');
const { repos } = require('./constants');
const { createNewRepository } = require('./utils/helpers');

require('dotenv').config();

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
  if (answers.framework === 'Express.js') {
    return repos.expressjs;
  }
};

const editor = (answers, terminal, projectPath) => {
  if (answers.editor === 'vim') {
    if (!terminal) {
      execa('alacritty', ['--working-directory', projectPath]);
    }
    execa(terminal, ['$(pwd)']);
  }
  if (answers.editor === 'vscode') {
    return execa('code', ['.']);
  }
};

const taskLists = (answers, argv) => {
  const projectName = answers.projectname;
  const projectPath = path.join(getCurrentDirectory, projectName);

  const repositoryStatus = `--${argv.status}`;
  const { terminal } = argv;

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

    {
      title: `Creating remote git repository`,
      task: async () => {
        await waitASecond();
        const repositoryName = `${projectName}`;
        await createNewRepository(repositoryName, repositoryStatus);
      },
    },
  ];

  const pushProjectToGitRepository = [
    {
      title: `Pushing local project to remote repository`,
      task: async () => {
        await waitASecond();
        await execa('git', ['add', '.']);
        await execa('git', ['commit', '-m', 'Initial Commit']);
        await execa('git', ['push', '-u', 'origin', 'master']);
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
      task: async () => {
        await execa('npm', ['install']);
      },
    },
    {
      title: `Opening Project`,
      task: async () => {
        await waitASecond();
        await editor(answers, terminal, projectPath);
      },
    },
  ];

  return [
    ...createLocalProject,
    ...createGitRepository,
    ...pushProjectToGitRepository,
    ...installLocalDependencies,
  ];
};

module.exports = taskLists;
