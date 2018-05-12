'use strict';
/* eslint no-console: 0 */
const _ = require('lodash');

process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('chalk');
const WebpackDevServer = require('webpack-dev-server');

const createWebpackCompiler = require('./utils/createWebpackCompiler');
const webpackConfigDev = require('./config/webpack.config.dev');
const webpackDevServerConfig = require('./config/webpackDevServer.config');

function start(conf = {}, callback) {
  const { protocol, port, hostname } = conf;
  const compiler = createWebpackCompiler(webpackConfigDev);

  // modify webpackDevServerConfig
  const newWebpackDevServerConfig = _.assign({}, webpackDevServerConfig, {
    https: protocol === 'https:',
    host: hostname,
    public: hostname,
  });

  const server = new WebpackDevServer(compiler,  newWebpackDevServerConfig);

  server.listen(port, hostname, err => {
    if (err) {
      console.log(colors.red('[ERR]: Failed to webpack dev server'));
      console.error(err.message || err);
      process.exit(1);
    }

    const serverUrl = `${protocol}//${hostname}:${port}/`;
    
    callback && callback();

    console.log('');
    console.log('');
    console.log(colors.green('Starting the development server at:'));
    console.log(`    ${colors.underline.white(serverUrl)}`);
    console.log('');
  });
}

module.exports = start;

