'use strict';

var Sequelize = require('sequelize');
var config = require('./config');

module.exports = new Sequelize(
  config.get('database:name'), 
  config.get('database:username'), 
  config.get('database:password'), 
  config.get('database:options')
);