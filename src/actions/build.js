const fs = require('fs');
const colors = require('colors');
const util = require('../lib/utils');
const glob = require('glob');
const { exec } = require('child_process');
const opn = require('opn');

const { preInstall, printCommandLog } = util;
const { log, error } = util.msg;

module.exports = function() {
  const workpath = process.cwd();
  const qoxJson = `${workpath}/qox.json`;
  const builderPath = '../builder';

  if (fs.existsSync(qoxJson)) {
    const { type, yarn, builder } = require(qoxJson);

    printCommandLog();
    preInstall(yarn);

    const useBuilder = require(`${builderPath}/${builder}/build`);

    exec(`node ${useBuilder}`);

  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);
  }
};
