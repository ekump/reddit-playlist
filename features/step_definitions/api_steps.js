var expect = require('chai').expect,
    localtunnel = require('localtunnel'),
    config = require('../../config'),
    selectorFor = require('../support/selectors').selectorFor,
    data = require('../support/data'),
    fs = require("fs"),
    nock = require('nock'),
    path = require('path');

module.exports = function () {
  this.Given(/^reddit returns the musicsubreddits.json file$/, function(next) {
    var fileName = path.join(process.cwd(),'features', 'support', 'fixtures', 'musicsubreddits.json');
    fs.readFile(fileName, 'utf8', function (err,data) {
      var scope = nock(config.reddit.baseURL)
        .persist()
        .intercept('/r/music/wiki/musicsubreddits.json', 'GET')
      scope.reply('200',data);
      next();
    });
  });

  this.Given(/the (spotify) API returns the following for a (GET|POST|PATCH) request to (.+):$/, function(service, verb, namedElement, table, next) {
    next();
  });

};
