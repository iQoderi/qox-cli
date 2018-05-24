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

      function uploadFile(key, localFile) {
        const uploadConf = {
          bucket: qiniu.uploadConf.bucket,
          filePrefix: 'code/npm',
          // version,
          key: `${name}/${version}/${key}`,
          localFile: `${currentPath}/build/${localFile}`
        };
  
        const pubSpinner = new Spinner(
          `正在上传打包文件到 CDN %s`
        );

        pubSpinner.start();
        const cdnPrefix = 'http://odljp7x9v.bkt.clouddn.com';
        // 调用
        qn.putFile(uploadConf).then((resp) => {
          console.log('');
          log(`上传打包文件${localFile}到 CDN 成功`.green);
          log(`预览地址: ${cdnPrefix}/${resp.key}`.green);
          pubSpinner.stop();
        }).catch((err) => {
          error('上传打包文件到 CDN 失败，请稍后重试'.red);
          pubSpinner.stop();      
        });
      };
      uploadFile('index.cmd.js', `js/${componentName}.js`);
      uploadFile('deps.json', 'deps.json');
    });
  } else {
    error(`Can not find ${'qox.json'.bold} in current directory`.red);    
  }
};
