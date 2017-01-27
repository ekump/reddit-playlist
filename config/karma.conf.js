'use strict'

const TEST_WEBPACK_CONFIG = require('./webpack.test');

module.exports = function(config) {
  let configuration = {
    basePath: '',
    frameworks: ['jasmine'],
    exclude: [ ],
    files: [
      { pattern: './src/test/test.component.html', nocache: true },
      { pattern: './config/spec-bundle.js', watched: false }
    ],
    preprocessors: { './config/spec-bundle.js': ['webpack'] },
    webpack: TEST_WEBPACK_CONFIG,
    coverageReporter: {
      type: 'in-memory'
    },
    remapCoverageReporter: {
      'text-summary': null,
      json: './coverage/coverage.json',
      html: './coverage/html'
    },
    webpackMiddleware: { stats: 'errors-only'},
    reporters: [ 'mocha', 'coverage' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      'Chrome'
    ],
    singleRun: true
  };

  config.set(configuration);
};