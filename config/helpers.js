'use strict'

let path = require('path');
let ROOT = path.resolve(__dirname, '..');

let root = function(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

module.exports.root = root;