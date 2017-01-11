let bodyParser = require('body-parser');
let express = require('express');
let cors = require('cors');
let request = require('request');
let dotenv = require('dotenv').config();
let config = require('../config');
let session = require('express-session');
let passport = require('passport');
let SpotifyStrategy = require('passport-spotify').Strategy;
//let SpotifyStrategy = require('../node_modules/passport-spotify/lib/index.js').Strategy;
console.log("STARTING SERVER");

//passport.use(new SpotifyStrategy({
  //clientID: config.spotify.clientID,
  //clientSecret: config.spotify.clientSecret,
  //callbackURL: 'http://localhost:4201/auth/spotify/callback'
  //},
  //function(accessToken, refreshToken, profile, done) {
    //console.log("in callback in config");
    //process.nextTick(function () {
      //console.log("in nextTick");
      //console.log("profile is: ", profile);
      //return done(null, profile);
    //});
  //}
//));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

passport.use(new SpotifyStrategy({
  clientID: config.spotify.clientID,
  clientSecret: config.spotify.clientSecret,
  callbackURL: 'http://localhost:4201/auth/spotify/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      // To keep the example simple, the user's spotify profile is returned to
      // represent the logged-in user. In a typical application, you would want
      // to associate the spotify account with a user record in your database,
      // and return that user instead.
      console.log("in next tick of passport");
      return done(null, profile);
    });
  }));

let app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());


app.get('/api/authenticate', function (req, res) {
  console.log("FETCHING FROM API");
  passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
    function(req, res){
      console.log("this should not be called");
    }
});

app.get('/auth/spotify/callback', function(req, res) {
  console.log("now we are in callback");
    passport.authenticate('spotify', { failureRedirect: '/login' }),
    function(req, res) {
      console.log("in func");
      res.redirect('/');
    }
});

app.listen(4201, () => console.log('REST API running on port 4201'));
