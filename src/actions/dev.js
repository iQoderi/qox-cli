const fs = require('fs');
const colors = require('colors');
const util = require('../lib/utils');
const glob = require('glob');
const { prompt } = require('inquirer');
const opn = require('opn');

const { preInstall, printCommandLog } = util;
const { log, error } = util.msg;

module.exports = function() {
  const workpath = process.cwd();
  const qoxJson = `${workpath}/qox.json`;

  if (fs.existsSync(qoxJson)) {
    const { type, yarn } = require(qoxJson);

    printCommandLog();

    const webpack = require('webpack');
    const webpackDevServer = require('webpack-dev-server');

    if (type === 'rax') {
      preInstall(yarn);
      
    }
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);
  }
};
