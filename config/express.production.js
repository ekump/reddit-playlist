'use strict'

const path = require('path');
const express = require('express');

let app = express();

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('[^\.]+', function response(req, res) {
  res.sendFile(path.join(__dirname, '..', 'dist/index.html'));
});

module.exports = app;