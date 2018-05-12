'use strict';
/* eslint no-console: 0 */
const colors = require('chalk');
const updateWebpackConfig = require('./updateWebpackConfig');
const webpack = require('webpack');


module.exports = webpackConfig => {
  let compiler;

  const config = updateWebpackConfig(webpackConfig);

  try {
    compiler = webpack(config);
  } catch (err) {
    console.error(colors.red('[ERR]: Failed to compile.'));
    console.log('');
    console.error(err.message || err);
    console.log('');
    process.exit(1);
  }

  compiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      return console.error(
        stats.toString({
          colors: true
        })
      );
    }

    console.log(
      stats.toString({
        colors: true,
        chunks: false,
        assets: true
      })
    );
  });

  compiler.plugin('failed', err => {
    throw err;
  });

  return compiler;
};
