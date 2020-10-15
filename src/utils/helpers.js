const fs = require('fs');

const execa = require('execa');

module.exports = {
  getCurrentDirectory: process.cwd(),
  exists: async filePath => !!fs.existsSync(filePath),
  createNewDirectory: async projectPath => fs.mkdirSync(projectPath),
  changeToNewDirectory: async projectPath => process.chdir(projectPath),
  createNewRepository: async name => {
    if (!name) {
      await execa('gh', ['repo', 'create']);
    }
    await execa('gh', ['repo', 'create', name]);
  },
};
