var expect = require('chai').expect,
    _ = require('lodash'),
    passport = require('passport'),
    localtunnel = require('localtunnel'),
    config = require('../../config'),
    selectorFor = require('../support/selectors').selectorFor,
    data = require('../support/data'),
    fs = require("fs"),
    nock = require('nock'),
    tableHelpers = require('cucumber-utils').table,
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

  this.Given(/^I am logged into (.+) as:$/, function (provider, table, next) {
    var strategy = passport._strategies[provider];
    var data = tableHelpers.rawToObject(table.raw());
    strategy._token_response = data.token_response;

    if (_.isObject(data.token_response.access_token)) {
      strategy._token_response.access_token = JWT.sign(data.token_response.access_token, 'super secret');
    } else {
      strategy._profile = data.profile;
    }
    next();
  });

  this.When(/^I auth using the (.+) strategy$/, function (strategy) {
    return browser.get('/auth/spotify'
        + '?strategy=' + strategy
        + '&client_id=' + config.passport.options.clientID
        + '&redirect_uri=' + config.passport.options.callbackURL);
  });

  this.Given(/the (spotify) API returns the following for a (GET|POST|PATCH) request to (.+):$/, function(service, verb, namedElement, table, next) {
    var tableObject = tableHelpers.rawToObject(table.raw());
    var apiPath = selectorFor(namedElement);
    var apiDomain = config.spotify.baseURL;

    var scope = nock(apiDomain)
      .persist()
      .intercept(apiPath, verb)

    scope.reply('200', tableHelpers.rawToObject(table.raw()));
    next();
  });
};
