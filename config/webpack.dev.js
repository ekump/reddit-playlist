'use strict'

const HELPERS       = require('./helpers');
const COMMON_CONFIG = require('./webpack.common.js');
const WEBPACK_MERGE = require('webpack-merge');

module.exports = WEBPACK_MERGE(COMMON_CONFIG.webpackCommon, {
  metadata: {
    title: COMMON_CONFIG.METADATA.title,
    baseUrl: COMMON_CONFIG.METADATA.baseUrl,
  },
  debug: true,
  devtool: 'cheap-module-source-map',
  node: {
    global: 'window',
    crypto: 'empty',
    process: true,
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
});
