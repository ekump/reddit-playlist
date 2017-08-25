'use strict'

const HELPERS = require('./helpers');
const WEBPACK = require('webpack');

const ASSETS_PLUGIN = require('assets-webpack-plugin');
const HTML_WEBPACK_PLUGIN = require('html-webpack-plugin');
const TS_LINT_CONF = require('./tslint.json');

const METADATA = {
  title: 'Reddit Playlist',
  baseUrl: '/',
};

let webpackCommon = {
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [ HELPERS.root('node_modules/rxjs') ],
      },
      {
        test: /\.ts$/,
        loader: 'tslint-loader'
      }
    ],
    loaders: [
      {
        test: /\.ts/,
        loaders: ['awesome-typescript-loader']
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [HELPERS.root('src/index.html')]
      },
      {
        test: /\.(jpe?g|png|eot|woff|ttf)$/,
        loader: 'file-loader'
      },
      {
        test: /global\.scss$/,
        loaders: ['to-string-loader', 'style-loader', 'css-loader', 'sass-loader']
      },
      {
        test: /\.scss$/,
        exclude: [/global\.scss$/],
        loaders: ['raw-loader', 'sass-loader']
      }
    ]
  },
  entry: {
    '1_polyfills': './polyfills.ts',
    '2_vendor': './vendor',
    '3_global_styles': './src/styles/global.scss',
    '4_app': './src/app/main'
  },
  output: {
    path: HELPERS.root('dist'),
    filename: '[name]_[chunkhash].bundle.js',
    sourceMapFilename: '[name]_[chunkhash].map'
  },
  tslint: {
    emitErrors: false,
    failOnHint: false,
    resourcePath: 'src',
    configuration: TS_LINT_CONF
  },
  resolve: {
    extensions: ['', '.js', '.ts'],
    modulesDirectories: ['node_modules'],
    root: HELPERS.root('src')
  },
  plugins: [
    new ASSETS_PLUGIN({
      path: HELPERS.root('dist'),
      filename: 'webpack-assets.json',
      prettyPrint: true
    }),

    new WEBPACK.optimize.CommonsChunkPlugin({
      name: ['1_polyfills']
    }),

    new WEBPACK.optimize.OccurenceOrderPlugin(true),

    new HTML_WEBPACK_PLUGIN({
      template: HELPERS.root('src') + '/index.html',
      chunksSortMode: function (a, b) {
         if (a.names[0] > b.names[0]) {
           return 1;
         }
         if (a.names[0] < b.names[0]) {
           return -1;
         }
         return 0;
       }
    }),

    new WEBPACK.ProvidePlugin({
      Reflect: 'core-js/es7/reflect'
    }),

    new WEBPACK.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  postcss: [
    require('autoprefixer')
  ]
}

module.exports.webpackCommon = webpackCommon;
module.exports.METADATA = METADATA;
