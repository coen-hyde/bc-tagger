'use strict';

var Promise = require('bluebird');
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
    sanitize: function() {
      var data = _.pick(this.get(), ['type', 'createdAt']);
      data.id = this.get('foreignId');
      data.tags = _.map(this.get('tags'), function(tag) {
        return tag.get('tag');
      });

      return data;
    },
    /*
     * Update entity tags. Remove all existing tags and create new ones
     *
     * @param {Array} tags
     * @return {Promise}
     */
    updateTags: function(tags) {
      var entity = this;
      var EntityTag = require('./entity-tag');

      // Remove all existing tags
      return this.setTags([])
        // Then create tags
        .then(function() {
          return Promise.map(tags, function(tag) {
            return EntityTag.create({tag: tag}).then(function(entityTag) {
              return entity.setTags([entityTag]);
            });
          });
        });
    }
  },
  classMethods: {
    associate: function(Models) {
      Entity.hasMany(Models['entity-tag'], {as: 'tags', constraints: false});
    },

    /*
     * Update entity tags. If entity already exists then replace tags with new tags
     *
     * @param {String} type
     * @param {Integer} id
     * @param {Array} tags
     */
    updateTags: function(type, id, tags, cb) {
      var EntityTag = require('./entity-tag');

      var query = {
        where: { type: type, foreignId: id }
      };

      Entity
        .findOrCreate(query)
        .spread(function(entity) {
          return entity.updateTags(tags)
        })
        .then(function() {
          query.include = [{ model: EntityTag, as: 'tags' }]
          return Entity.findOne(query);
        })
        .nodeify(cb);
    },
  }
});

module.exports = Entity;