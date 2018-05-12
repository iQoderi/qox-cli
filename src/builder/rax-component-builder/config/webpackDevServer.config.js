'use strict';

const config = require('./webpack.config.prod');
const pathConfig = require('./path.config');
// const envConfig = require('./env.config');

module.exports = {
  compress: true,
  clientLogLevel: 'none',
  contentBase: pathConfig.appPublic,
  watchContentBase: true,
  hot: true,
  publicPath: config.output.publicPath,
  quiet: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  // https: envConfig.protocol === 'https:',
  // host: envConfig.host,
  // public: envConfig.host,
  overlay: false,
};
