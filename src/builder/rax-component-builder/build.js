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

function build(config) {
  const compiler = createWebpackCompiler(config);

  compiler.run(err => {
    if (err) {
      throw err;
    }

    console.log(colors.green('\nBuild successfully.'));
  });
}

rimraf(pathConfig.appBuild, err => {
  if (err) {
    throw err;
  }
  build(webpackConfigProd);
});
