'use strict';
/* eslint no-console: 0 */
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const rimraf = require('rimraf');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const pathConfig = require('./config/path.config');
const webpackConfigProd = require('./config/webpack.config.prod');

function build(notify) {
  const compiler = createWebpackCompiler(webpackConfigProd);

  compiler.run(err => {
    if (err) {
      throw err;
    }

    typeof notify === 'function' && notify(true);
  });
}

module.exports = function(notify) {
  rimraf(pathConfig.appBuild, err => {
    if (err) {
      throw err;
    }
    build(notify);
  });
};
