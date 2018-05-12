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

// 检测port是否被占用
// @see https://segmentfault.com/q/1010000006954465
const probe = function(port, callback) {
  var server = net.createServer().listen(port)

  var calledOnce = false

  var timeoutRef = setTimeout(function () {
      calledOnce = true
      callback(false,port)
  }, 2000)

  timeoutRef.unref()

  var connected = false

  server.on('listening', function() {
      clearTimeout(timeoutRef)

      if (server)
          server.close()

      if (!calledOnce) {
          calledOnce = true
          callback(true,port)
      }
  })

  server.on('error', function(err) {
      clearTimeout(timeoutRef)

      var result = true
      if (err.code === 'EADDRINUSE')
          result = false

      if (!calledOnce) {
          calledOnce = true
          callback(result, port)
      }
  })
}

module.exports = {
  currentDir,
  existDir,
  preInstall,
  printCommandLog,
  probe,
  msg: {
    log,
    warn,
    error,
  }
};
