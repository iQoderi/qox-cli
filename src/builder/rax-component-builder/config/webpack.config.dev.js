'use strict';
const webpack = require('webpack');
const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.base');

const webpackConfigDev = Object.assign({}, webpackConfigBase);

// enable source map
webpackConfigDev.devtool = 'inline-module-source-map';
webpackConfigDev.entry = {
  'index.bundle': [pathConfig.appDemoJs]
};

Object.keys(webpackConfigDev.entry).forEach(point => {
  // hot reaload client.
  webpackConfigDev.entry[point].unshift(require.resolve('../hmr/webpackHotDevClient.entry'));
});

// Only work on web
webpackConfigDev.plugins.push(new webpack.NoEmitOnErrorsPlugin());

module.exports = webpackConfigDev;
