'use strict'

const request = require('request'),
      url = require('url'),
      config = require('../config'),
      proxy = require('express')();

proxy.all('*', function (req, res, next) {
  let currentUrl = url.parse(req.url);
  let apiUrl = url.parse(config.spotify.baseURL);

  apiUrl.pathname = currentUrl.pathname;
  if (currentUrl.query) {
    apiUrl.search = "?" + currentUrl.query;
  }

  apiUrl = url.format(apiUrl);

  req.pipe(request(apiUrl)).pipe(res)
});

module.exports = proxy;
