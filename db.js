'use strict';

var winston = require('winston');
var Sequelize = require('sequelize');
var config = require('./config');

var options = config.get('database:options');
options.logging = function(msg) {
  winston.debug(msg);
}

module.exports = new Sequelize(
  config.get('database:name'), 
  config.get('database:username'), 
  config.get('database:password'), 
  options
);