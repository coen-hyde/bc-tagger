'use strict';

var Sequelize = require('Sequelize');
var db = require('../db');

var Entity = db.define('Entity', {
  type: Sequelize.STRING
});

module.exports = Entity;