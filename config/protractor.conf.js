'use strict'

const Q = require('q'),
      selenium = require('selenium-server-standalone-jar');

exports.config = {
  seleniumServerJar: selenium.path,
  chromeOnly: true,
  useAllAngular2AppRoots: true,
  allScriptsTimeout: 20000,
  baseUrl: 'http://localhost:4200',
  specs: [ 'features/*.feature'
  ],
  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: ['show-fps-counter=true']
    }
  },
  cucumberOpts: {
    require: 'features/step_definitions',
    tags: '~@wip',
    format: 'pretty'
  },
  onPrepare: function() {
    browser.ignoreSynchronization = true;
  }
};
