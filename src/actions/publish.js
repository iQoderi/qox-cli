const fs = require('fs');
const QiniuSdk = require('qiniu-sdk');
const colors = require('colors');
const { exec } = require('child_process');
const util = require('../lib/utils');
const rm = require('rimraf');

const { error } = util.msg;

module.exports = function() {
  const currentPath = process.cwd();
  const qoxJsonPath = `${currentPath}/qox.json`;

  if (fs.existsSync(qoxJsonPath)) {
    const qoxJson = require(qoxJsonPath);
    const pkg = require(`${currentPath}/package.json`);    

    const { qiniu } = qoxJson;

    rm(`${currentPath}/build`, function() {
      // todo
    });
    exec('qox build');

    const qn = new QiniuSdk(qiniu.key);
    const { name, version } = pkg;

    console.log(name, version);

    // const uploadConf = {
    //   bucket: 'neuqst',
    //   filePrefix: 'code/npm',
    //   version: '0.0.1',
    //   key: 'roxBundle.js',
    //   localFile: './index.js'
    // };

    // // 调用
    // qn.putFile(uploadConf).then((resp) => {
    //   console.log(resp);
    // }).catch((err) => {
    //   console.log(err);
    // });
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);    
  }
};
