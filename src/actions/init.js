const fs = require('fs');
const colors = require('colors');
const template = require('../config/initTemplate');
const util = require('../lib/utils');
const mkdirp = require('mkdirp');
const { Spinner } = require('cli-spinner');
const download = require('download-git-repo');
const { exec } = require('child_process');
const { prompt } = require('inquirer');

const { log, warn, error } = util.msg;
const REG_PATH = /^([a-zA-Z0-9_-]+)$/ig;

const initProject = function(path, projectName, create, clear) {
  prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Choice the project type',
      choices: Object.keys(template),
    },
  ]).then(({ type }) => {
    log(`The root path: ${path.blue}`);

    if (clear) {
      log(`running path clear process`);
      exec(`rm -rf ${path}`);
    }

    return create
      ? mkdirp(path, () => downloadProject(path, projectName, type))
      : downloadProject(path, projectName, type);
  });
};

const downloadProject = function(path,  projectName, type) {
  if (template[type]) {
    const spinner = new Spinner(
      `${'info'.green.bold} init create ${type.red} %s`
    );

    spinner.start();
    // spinner.setSpinnerString(1);

    download(template[type], path, err => {
      spinner.stop();
      process.stdout.write('\n');

      if (err){
        error('init error'.red)
      } else {
        const pkg = require(`${path}/package.json`);
        const REG_QOX = /^qox-/ig;
        const name = projectName.match(REG_QOX) ? projectName : `qox-${projectName}`;

        // 修改 package.json 模块名
        pkg.name = name;
        fs.writeFile(`${path}/package.json`, JSON.stringify(pkg, null, 4), null, function(err) {
          if (err) {
            error(`修改 package name 失败，请手动修改，格式（qox-${name}）`);
          }
        });

        // 初始化 git 仓库
        log('初始化 git 仓库');

        // 
        exec('git init');

        log('init complete');        
      }
    });
  } else {
    error('can not find typeof project template on remote gitsource'.red);
  }
};

module.exports = function(ProjectName) {
  const initProjectName = !!ProjectName;
  const projectName = ProjectName || util.currentDir() || '';
  const path = `${process.cwd()}${initProjectName ? `/${projectName}` : ''}`;
  const pathInvalid = projectName.match(ProjectName);

  if (!pathInvalid) {
    return error(
      `initialize project name as ${projectName.bold} is invalid`.red
    );
  }

  log(`initialize: { ${projectName.red.bold} }`);

  if (initProjectName) {
    const dirExist = util.existDir(path);

    if (dirExist) {
      prompt([
        {
          type: 'confirm',
          name: 'overwritte',
          message: `${projectName.blue.bold} directory already exists, whether to perform overwrite operation?`,
          default: false,
        },
      ]).then(({ overwritte }) => {
        if (overwritte) {
          initProject(path, projectName, true, true);
        }
      });
    } else {
      initProject(path, projectName, true);
    }

  } else {
    const files = fs.readdirSync(path);

    if (files.length) {
      files.forEach(file => console.log(file.blue));

      prompt([
        {
          type: 'confirm',
          name: 'overwritte',
          message: `${projectName}The directory already exists above the file, whether to continue to perform initialization?`,
          default: false,
        },
      ]).then(({ overwritte }) => {
        if (overwritte) {
          warn('Mandatory initialization operation!'.yellow);
          initProject(path, projectName);
        }
      });
    } else {
      initProject(path, projectName);
    }
  }
};
