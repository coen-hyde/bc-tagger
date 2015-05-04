'use strict';

var requirize = require('requirize');
var db = require('../db');
var Models = requirize(__dirname);

Object.keys(Models).forEach(function(modelName) {
  if ('associate' in Models[modelName]) {
    Models[modelName].associate(Models);
  }
});

Models.db = db;

module.exports = Models;