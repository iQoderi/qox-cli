'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const colors = require('chalk');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const RaxWebpackPlugin = require('rax-webpack-plugin');
const DepsWebpackPlugin = require('webpack-depsjson-plugin');
const webpack = require('webpack');
const pathConfig = require('./path.config');
const babelConfig = require('./babel.config');

const publicPath = '/';
const publicUrl = '';

const shouldExternalBuiltInModules = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  context: process.cwd(),
  target: 'web',
  entry: {},

  output: {
    path: pathConfig.appBuild,
    pathinfo: true,
    filename: 'js/[name].js',
    publicPath: publicPath,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  plugins: [
    new RaxWebpackPlugin({
      target: 'cmd',
      builtinModules: {
        rax: ['rax'],
        'rax-components': ['rax-components']
      },
      externalBuiltinModules: shouldExternalBuiltInModules
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: pathConfig.appHtml
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        PUBLIC_URL: JSON.stringify(publicUrl)
      }
    }),
    new CaseSensitivePathsPlugin(),
    new webpack.ProgressPlugin(function(percentage, msg) {
      const stream = process.stderr;
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0);
        stream.write(`webpack: ${msg}...`);
        stream.clearLine(1);
      } else if (percentage === 1) {
        console.log('');
        console.log('webpack: bundle build is now finished.'.green);
      }
    }),
    // 生成deps.json
    new DepsWebpackPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'ts-loader'
          }
        ],
      },
      {
        test: /\.jsx?$/,
        // exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            query: babelConfig
          }
        ],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: require.resolve('stylesheet-loader')
          }
        ],
      },
      {
        test: /\.json$/,
        use: [
          {
            loader: require.resolve('json-loader')
          }
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: require.resolve('image-source-loader')
          }
        ],
      }
    ]
  }
};
