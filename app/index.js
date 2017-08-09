'use strict'

const path = require('path');
const express = require('express');
const config = require('../config');
const session = require('express-session');
const fs = require('fs');
const passport = require('passport');
const strategy = require('passport-spotify').Strategy;

let app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(session(config.session));
app.use(require('morgan')(config.logger));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/s/', require('./require_spotify_user'), require('./spotify_proxy'));
app.use('/r/', require('./reddit_proxy'));

passport.deserializeUser(function(accessToken, done) { done(null, accessToken); });
passport.serializeUser(function(accessToken, done) { done(null, accessToken) });

passport.use(new strategy(config.passport.options, function (accessToken, refreshToken, profile, next) {
  next(null, { accessToken: accessToken, refreshToken: refreshToken })
}));
app.get('/auth/spotify', passport.authenticate('spotify'));
app.get('/auth/spotify/callback', passport.authenticate('spotify', { failureRedirect: '/login', successRedirect: '/home' }));

app.get('/auth/spotify/logged-in', function(req, res, next) {
  if ((req.session.passport) && (req.session.passport.user) && (req.session.passport.user.accessToken)) {
    res.send(true);
  }
  else {
    res.send(false);
  }
});

if (config.serveStaticAssets) {
  app.use('/', require('../config/express.production'));
} else {
  app.use('/', require('../config/webpack.middleware'));
}

module.exports = function () {
  return app.listen(config.port, '0.0.0.0', function (err) {
    if (err) { console.log(err); }
    console.info('==> 🌎  Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', config.port, config.port);
  });
};
