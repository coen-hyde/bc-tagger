'use strict';

var Sequelize = require('Sequelize');
var db = require('../db');
var Entity = require('./entity');

var Tag = db.define('Tag', {
  tag: Sequelize.STRING
});

Tag.BelongsTo(Entity);

module.exports = Tag;