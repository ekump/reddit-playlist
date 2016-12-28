function clone (o) { return JSON.parse(JSON.stringify(o)); }

var defaultEnv = {
  env:  process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  logger: 'dev',
  spotify: {
    clientID: process.env.SPOTIFY_CLIENT_ID || 'no_id',
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET || 'no_secret'
  }
};

var envs = {
  test: clone(defaultEnv),
  development: clone(defaultEnv),
  production: clone(defaultEnv)
};



module.exports = envs[process.env.NODE_ENV] || envs.development;
