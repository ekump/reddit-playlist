'use strict'

const HELPERS             = require('./helpers');
const COMMON_CONFIG       = require('./webpack.common.js');
const WEBPACK             = require('webpack');
const WEBPACK_MERGE       = require('webpack-merge');
const WEBPACK_MD5_HASH    = require('webpack-md5-hash');
const UGLIFY_JS_PLUGIN    = require('webpack/lib/optimize/UglifyJsPlugin');
const EXTRACT_TEXT_PLUGIN = require('extract-text-webpack-plugin');
const ENV_PLUGIN          = require('webpack/lib/EnvironmentPlugin');

module.exports = WEBPACK_MERGE(COMMON_CONFIG.webpackCommon, {
  metadata: {
    title: COMMON_CONFIG.METADATA.title,
    baseUrl: COMMON_CONFIG.METADATA.baseUrl,
  },
  debug: false,
  devtool: 'source-map',
  plugins: [
    new WEBPACK_MD5_HASH(),
    new UGLIFY_JS_PLUGIN({
      beautify: false,
      mangle: {
        screw_ie8 : true,
        keep_fnames: true
       },
      compress: {
        screw_ie8: true
      },
      comments: false
    }),
    new EXTRACT_TEXT_PLUGIN('[name]_[hash].min.css'),
    new ENV_PLUGIN([
      'NODE_ENV',
      'SPOTIFY_API_CLIENT_ID',
      'SPOTIFY_API_CLIENT_SECRET',
      'REDIS_URL'
    ]),
    new WEBPACK.DefinePlugin({
      AppConfig: {
        useProductionAngular: true
      }
    })
  ]
});
