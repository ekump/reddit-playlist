const HELPERS = require('./helpers');
const COMMON_CONFIG = require('./webpack.common');
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';
const WEB_COMPONENTS_BASE_URL = 'http://127.0.0.1:9888/c/';

module.exports = {
  metadata: {
    title: COMMON_CONFIG.METADATA.title,
    webComponentsUrl: `${WEB_COMPONENTS_BASE_URL}${COMMON_CONFIG.METADATA.webComponents}.html`
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['', '.ts', '.js'],
    root: HELPERS.root('src'),
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/
      },
      { test: /\.html$/,
        loader: 'raw-loader',
        exclude: [HELPERS.root('src/index.html')]
      },
      {
        test: /global\.scss$/,
        loaders: ['to-string-loader', 'style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.scss$/,
        exclude: [/global\.scss$/],
        loaders: ['raw-loader', 'sass-loader']
      },
      { test: /\.(eot|woff|ttf)$/,
        loader: 'file-loader'
      }
    ],
    postLoaders: [
      {
        test: /\.ts$/,
        loader: 'istanbul-instrumenter-loader',
        exclude: [
          'node_modules',
          /\.spec\.ts$/
        ]
      }
    ]
  }
};
