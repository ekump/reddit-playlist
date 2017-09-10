function clone (o) { return JSON.parse(JSON.stringify(o)); }

var defaultEnv = {
  env:  process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4200,
  serveStaticAssets: process.env.SERVE_STATIC_ASSETS,
  useProductionAngular: process.env.USE_PRODUCTION_ANGULAR,
  logger: 'dev',
  session: {
    secret: process.env.SESSION_SECRET || 'super-sekret'
  },
  passport: {
    strategy: 'passport-spotify',
    options: {
      name: 'spotify',
      clientID: process.env.SPOTIFY_API_CLIENT_ID || 'default-spotify-client-id',
      clientSecret: process.env.SPOTIFY_API_CLIENT_SECRET || 'default-spotify-client-secret',
      callbackURL: '/auth/spotify/callback'
    }
  },
  spotify: {
    baseURL: 'https://api.spotify.com'
  },
  reddit: {
    baseURL: 'https://www.reddit.com'
  },
  redis: {
    url: process.env.REDIS_URL || 'http://localhost',
    redditCacheTTL: 3200
  }
};

var envs = {
  test: clone(defaultEnv),
  development: clone(defaultEnv),
  staging: clone(defaultEnv),
  production: clone(defaultEnv)
};

envs.test.passport.strategy = 'passport-mocked';
envs.test.passport.options.clientID = 'reddit-playlist-generator';
envs.test.passport.options.clientSecret = 'reddit-playlist-generator-secret';

envs.production.logger = 'tiny';

module.exports = envs[process.env.NODE_ENV] || envs.development;
