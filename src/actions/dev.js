const fs = require('fs');
const colors = require('colors');
const address = require('address');
const glob = require('glob');
const opn = require('opn');
const { exec } = require('child_process');
const util = require('../lib/utils');

const { preInstall, printCommandLog, probe } = util;
const { log, error } = util.msg;

module.exports = function() {
  const workpath = process.cwd();
  const qoxJson = `${workpath}/qox.json`;
  const builderPath = '../builder';

  if (fs.existsSync(qoxJson)) {
    const { type, yarn, builder } = require(qoxJson);

    printCommandLog();
    exec('git branch', function(err, data) {
      console.log(err);
      console.log(data);
    });

    preInstall(yarn);

    const startDev = require(`${builderPath}/${builder}/dev`);

    const protocol = process.env.HTTPS === 'true' ? 'https:' : 'http:';
    const hostname = process.env.HOST || address.ip();
    let port = 8080;

    probe(port, function(inVaild) {
     
      if (inVaild) {
        console.log(`检测到端口(${port})已被占用，自动启用端口 ${port + 1}`.red);
        port = port + 1;
      }

      const serverConf = {
        protocol,
        hostname,
        port
      };
  
      startDev(serverConf, function() {
        const serverUrl = `${protocol}//${hostname}:${port}/`;
        opn(serverUrl);     
      });
    });
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);
  }
};
