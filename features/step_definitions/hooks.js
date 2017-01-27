var chalk = require('chalk'),
    Q = require('q'),
    data = require('../support/data');

require('chai').use(require('chai-as-promised'));
var appServer;

module.exports = function () {
  this.setDefaultTimeout(10 * 60 * 1000);

  this.BeforeFeatures(function () {
    var deferred = Q.defer();

    appServer = require('../../app')();
    appServer.on('listening', function () {
      deferred.resolve();
    });

    return deferred.promise;
  });

  this.BeforeFeatures(function () {
    return browser.driver.manage().window().setSize(1280, 800);
  });

  this.After({ timeout: 1000 * 5 * 60 }, function () {
    return browser.manage().logs().get('browser').then(function(logs) {
      logs.forEach(function(log) {
        if (log.level.value > 900) {
          console.log(chalk.white.bgRed('*****BROWSER ERROR*****\n', log.message));
        }
      });
    });
  });

  this.AfterFeatures(function () {
    appServer.close();
  });
}