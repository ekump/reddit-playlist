'use strict';

module.exports = function (req, res, next){
  if (
    req.session.passport &&
    req.session.passport.user &&
    req.session.passport.user.accessToken
  ) {
    req.headers['Authorization'] =
      'Bearer ' + req.session.passport.user.accessToken;
  }
  next();
};
