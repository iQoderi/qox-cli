process.env.NODE_ENV = 'development';

process.on('unhandledRejection', err => {
  throw err;
});

const colors = require('colors');
const webpackDevServer = require('webpack-dev-server');

