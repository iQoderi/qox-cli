'use strict';
const webpack = require('webpack');

const pathConfig = require('./path.config');
const webpackConfigBase = require('./webpack.config.base');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

const webpackConfigProd = Object.assign({}, webpackConfigBase);
const currentDir = process.cwd();
const pkg = require(`${currentDir}/package.json`);
const entryName = pkg.name;

webpackConfigProd.entry = {
  [entryName]: [pathConfig.appIndexJs]
};

// rax 外部引入
// webpackConfigProd.externals = ['rax'];

webpackConfigProd.output.pathinfo = false;
webpackConfigProd.target = 'node';

webpackConfigProd.plugins.push(
  new UglifyJSPlugin({
    include: /\.min\.js$/,
    cache: true,
    sourceMap: true,
  })
);

module.exports = webpackConfigProd;
