'use strict';

var Sequelize = require('Sequelize');
var _ = require('lodash');
var db = require('../db');

var Entity = db.define('Entity', {
  type: { type: Sequelize.STRING, unique: 'compositeIndex' },
  foreignId: { type: Sequelize.INTEGER, unique: 'compositeIndex' }
}, {
  instanceMethods: {
    /*
     * Filter and transform entity for public consumption
     */
    public: function() {
      var data = _.pick(this.get(), ['id', 'type', 'createdAt']);
      data.tags = _.map(this.get('tags'), function(tag) {
        return tag.get('tag');
      });

      return data;
    },
  },
  classMethods: {
    associate: function(Models) {
      Entity.hasMany(Models['entity-tag'], {as: 'tags', constraints: false});
    }
  }
});

module.exports = Entity;