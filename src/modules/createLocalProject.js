const path = require('path');

const execa = require('execa');
const chalk = require('chalk');
const Listr = require('listr');

const { repos } = require('../constants');
const waitASecond = require('../utils/timeouts');
const files = require('../utils/files');

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

const createLocalProject = async answers => {
  const {
    directoryExists,
    getCurrentDirectory,
    createNewDirectory,
    changeToNewDirectory,
  } = files;

  const projectName = answers.projectname;
  const projectPath = path.join(getCurrentDirectory, projectName);

  const tasks = new Listr([
    {
      title: `Creating project directory for ${answers.name}`,
      task: async () => {
        await waitASecond();
        createNewDirectory(projectPath).catch(() => {
          if (directoryExists(projectPath)) {
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
      title: `Cloning repo into ${answers.name} directory`,
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
  ]);

  tasks.run();
};

module.exports = createLocalProject;
