#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const chalk = require('chalk');
const semver = require('semver');
const cli = require('commander');
const colors = require('colors');
const pkg = require('../package.json');

const CMD_INIT = require('../src/actions/init');
const CMD_DEV = require('../src/actions/dev');
const CMD_BUILD = require('../src/actions/build');
const CMD_PUBLISH = require('../src/actions/publish');
const CMD_LINT = require('../src/actions/lint');

// Update notifications
updateNotifier({pkg}).notify();

// Check node version
if (!semver.satisfies(process.version, '>=6')) {
  const message = 'You are currently running Node.js ' +
    chalk.red(process.version) + '.\n' +
    '\n' +
    'qox-cli runs on Node 6.0 or newer. There are several ways to ' +
    'upgrade Node.js depending on your preference.\n' +
    '\n' +
    'nvm:       nvm install node && nvm alias default node\n' +
    'Homebrew:  brew install node\n' +
    'Installer: download the Mac .pkg from https://nodejs.org/\n';

  console.log(message);
  process.exit(1);
}

const commands = ['init', 'dev', 'lint', 'build', 'publish'];

cli
  .version(pkg.version, '-v, --version')
  .usage('[command]'.green)
  .description(pkg.description.green);

// register commands
cli
  .command('init [ProjectName]')
  .description('init Project'.green)
  .action(CMD_INIT);


cli
  .command('dev')
  .description('start dev'.green)
  .action(CMD_DEV);

cli
  .command('build')
  .description('build project'.green)
  .action(CMD_BUILD);

cli
  .command('publish')
  .description('build and publish project to cdn'.green)
  .action(CMD_PUBLISH)

cli
  .command('lint <path> [param]')
  .description('lint code style'. green)
  .action(CMD_LINT);

// help
cli
  .command('help')
  .description('check help infomation'.green)
  .action(() => cli.help());

cli.parse(process.argv);

if (!cli.args.length || !process.argv[2] || !commands.includes(process.argv[2])) {
  cli.help();
}
