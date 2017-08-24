'use strict'

const TEST_WEBPACK_CONFIG = require('./webpack.test');

module.exports = function(config) {
  let configuration = {
    basePath: '',
    frameworks: ['jasmine', 'source-map-support'],
    exclude: [ ],
    files: [
      { pattern: './src/test/test.component.html', nocache: true },
      { pattern: './config/spec-bundle.js', watched: false }
    ],
    preprocessors: {
      './config/spec-bundle.js': ['webpack'],
      './src/**/*.spec.ts': ['webpack']
    },
    reporters: [ 'mocha', 'coverage', 'coverage-istanbul' ],
    webpack: TEST_WEBPACK_CONFIG,
    coverageReporter: {
      reporters: [
        {
          type: 'json',
          dir: 'coverage/json',
          subdir: '.'
        }
      ]
    },
    coverageIstanbulReporter: {
      reports: ['text', 'html' ],
      thresholds: {
        emitWarning: true,
        global: {
          statements: 95,
          lines: 95,
          branches: 95,
          functions: 95
        },
        each: {
          statements: 95,
          lines: 95,
          branches: 85,
          functions: 95
        }
      }
    },
    webpackMiddleware: { stats: 'errors-only'},
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: [
      'Chrome'
    ],
    singleRun: true,
    browserConsoleLogOptions: {
      terminal: true,
      level: ""
    }
  };

  config.set(configuration);
};
