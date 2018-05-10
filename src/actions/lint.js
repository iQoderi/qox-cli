const fs = require('fs');
const colors = require('colors');
const utils = require('../lib/utils');

const { printCommandLog, msg } = utils;

module.exports = function(path, options) {
  const QOX_JSON_PATH = `${process.cwd()}/qox.json`;

  if (fs.existsSync(QOX_JSON_PATH)) {
    printCommandLog();

    const QOX_JSON = require(QOX_JSON_PATH);
    
    let startPath = `${process.cwd()}/`;

    if ('.' === path) {
      startPath = `${startPath}**/*.js`;
    } else {
      startPath = `${startPath + path}/**/*.js`;
    }

    const type = QOX_JSON.type;
    const eslintConfig = require('../config/eslintrc')[type];
    const eslint = require('eslint');

    const cli = new eslint.CLIEngine(eslintConfig);

    msg.log(
      `use Eslint check code style version: ${eslint.CLIEngine.version.blue}`
    );

    const formatter = cli.getFormatter();
    const report = cli.executeOnFiles([startPath]);

    console.log(formatter(report.results));

    // fix code style
    if (options.fix) {
      eslint.CLIEngine.outputFixes(report);
    }
  } else {
    msg.error(`Cannot find ${'qox.json'.bold} in current diretory`);
  }
}
