const fs = require('fs');
const colors = require('colors');
const util = require('../lib/utils');
const glob = require('glob');
const { exec } = require('child_process');
const rm = require('rimraf');

const { preInstall, printCommandLog } = util;
const { log, error } = util.msg;

module.exports = function(callback) {
  const workpath = process.cwd();
  const qoxJson = `${workpath}/qox.json`;
  const builderPath = '../builder';

  if (fs.existsSync(qoxJson)) {
    const { type, yarn, builder } = require(qoxJson);
    const NODE_MODULES = `${process.cwd()}/node_modules`;

    log(`重新安装依赖`.green);    
    rm(NODE_MODULES, function() {
      printCommandLog();
      preInstall(yarn);

      const useBuilder = require(`${builderPath}/${builder}/build`);
      
      log(`执行构建文件`.green);
      useBuilder(callback);
    });
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);
  }
};
