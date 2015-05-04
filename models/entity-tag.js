'use strict';

var Sequelize = require('Sequelize');
var db = require('../db');
var Entity = require('./entity');

var Tag = db.define('Tag', {
  tag: Sequelize.STRING
});

Tag.belongsTo(Entity);

module.exports = Tag;