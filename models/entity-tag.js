'use strict';

var Sequelize = require('Sequelize');
var db = require('../db');

var EntityTag = db.define('EntityTag', {
  tag: Sequelize.STRING
});

module.exports = EntityTag;