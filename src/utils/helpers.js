const fs = require('fs');

module.exports = {
  getCurrentDirectory: process.cwd(),
  exists: async filePath => fs.existsSync(filePath),
  createNewDirectory: async projectPath => fs.mkdirSync(projectPath),
  changeToNewDirectory: async projectPath => process.chdir(projectPath),
};
