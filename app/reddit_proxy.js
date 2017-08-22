'use strict';

const request = require('request'),
  url = require('url'),
  config = require('../config'),
  proxy = require('express')(),
  redis = require('redis');

require('redis-streams')(redis);

var redisClient = redis.createClient(config.redis.url);
redisClient.on('ready', function (){
  console.log('redis client is ready on url: ', config.redis.url);
});

proxy.all('*', function (req, res, next){
  let currentUrl = url.parse(req.url);
  let apiUrl = url.parse(config.reddit.baseURL);

  apiUrl.pathname = currentUrl.pathname;
  if (currentUrl.query) {
    apiUrl.search = '?' + currentUrl.query;
  }

  apiUrl = url.format(apiUrl);
  redisClient.exists(apiUrl, function (err, exists){
    if (err) return next(err);
    exists
      ? redisClient.readStream(apiUrl).pipe(res)
      : request(apiUrl)
          .pipe(redisClient.writeThrough(apiUrl, config.redis.redditCacheTTL))
          .pipe(res);
    res.send;
  });
});

module.exports = proxy;
