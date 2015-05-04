'use strict';

var requirize = require('requirize');
var Models = requirize(__dirname);

Object.keys(Models).forEach(function(modelName) {
  if ('associate' in Models[modelName]) {
    Models[modelName].associate(Models);
  }
});

module.exports = Models;