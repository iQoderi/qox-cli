const fs = require('fs');
const path = require('path');
const colors = require('colors');
const { execSync } = require('child_process');

const QOX_LOGO = `
   ____            
  / __ \           
 | |  | | _____  __
 | |  | |/ _ \ \/ /
 | |__| | (_) >  < 
  \___\_\\___/_/\_\
`;

const currentDir = function() {
  return path.basename(process.cwd());
};

const existDir = function(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch(e) {
    return false;
  }
};

const log = function(msg) { console.log(`${'info'.green.bold} ${msg}`); };

const warn = function(msg) { console.log(`${'warn'.yellow.bold} ${msg}`); };

const error = function(msg) { console.log(`${'error'.red.bold} ${msg}`); };

const printCommandLog = function() { console.log(QOX_LOGO.red, '\n'); };

const preInstall = function(yarn) {
  log(`installing dependencies ${(yarn ? 'yarn' : 'npm').green} node packages`);
  execSync(yarn ? 'yarn install' : 'npm install');
};

module.exports = {
  currentDir,
  existDir,
  preInstall,
  printCommandLog,
  msg: {
    log,
    warn,
    error,
  }
};
