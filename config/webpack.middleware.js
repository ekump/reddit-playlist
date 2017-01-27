'use strict'

const path = require('path');
const express = require('express');
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.dev');
const middlewareCompiler = webpack(config);
const middleware = webpackMiddleware(middlewareCompiler, {
  publicPath: config.output.publicPath,
  contentBase: 'src',
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }
});
const morgan = require('morgan');

let app = express();

app.use(morgan('dev'));
app.use(middleware);
app.use(webpackHotMiddleware(middlewareCompiler));

app.get('[^\.]+', function response(req, res) {
  res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '..', 'dist/index.html')));
  res.end();
});

module.exports = app;
