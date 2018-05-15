const fs = require('fs');
const QiniuSdk = require('qiniu-sdk');
const colors = require('colors');
const { Spinner } = require('cli-spinner');
const { exec } = require('child_process');
const util = require('../lib/utils');
const build = require('./build');
const rm = require('rimraf');

const { log, error } = util.msg;

module.exports = function() {
  const currentPath = process.cwd();
  const qoxJsonPath = `${currentPath}/qox.json`;

  if (fs.existsSync(qoxJsonPath)) {
    const qoxJson = require(qoxJsonPath);
    const pkg = require(`${currentPath}/package.json`);
    const componentName = pkg.name;  

    const { qiniu } = qoxJson;

    build(function(ret) {
      const qn = new QiniuSdk(qiniu.key);
      const { name, version } = pkg;

      const uploadConf = {
        bucket: qiniu.uploadConf.bucket,
        filePrefix: 'code/npm',
        // version,
        key: `${name}/${version}/index.cmd.js`,
        localFile: `${currentPath}/build/js/${componentName}.js`
      };

      const pubSpinner = new Spinner(
        `正在上传打包文件到 CDN %s`
      );
      pubSpinner.start();
      // 调用
      qn.putFile(uploadConf).then((resp) => {
        console.log('');
        log('上传打包文件到 CDN 成功'.green);
        pubSpinner.stop();
      }).catch((err) => {
        error('上传打包文件到 CDN 失败，请稍后重试'.red);
        pubSpinner.stop();      
      });
    });
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);    
  }
};
