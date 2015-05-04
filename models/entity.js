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
      return EntityTag.destroy({where: {EntityId: entity.id}})
        // Then create tags
        .then(function() {
          return Promise.map(tags, function(tag) {
            return EntityTag.create({tag: tag}).then(function(entityTag) {
              return entity.setTags([entityTag]);
            });
          });
        })
        .return(entity);
    },

    /*
     * Delete entity
     *
     * @return {Promise}
     */
    delete: function() {
      var entity = this;
      var EntityTag = require('./entity-tag');
      
      return EntityTag
        .destroy({where: {EntityId: entity.id}})
        .then(function() {
          return entity.destroy();
        })
    }
  },
  classMethods: {
    associate: function(Models) {
      Entity.hasMany(Models['entity-tag'], {as: 'tags', constraints: false});
    },

    /*
     * Find an entity by it's type and foreignId
     *
     * @param {String} type
     * @param {Integer} id
     * @return {Promise}
     */
    findByTypeAndId: function(type, id) {
      var EntityTag = require('./entity-tag');

      // Cast id as integer
      id = parseInt(id, 10);

      var query = {
        where: { type: type, foreignId: id },
        include: [ { model: EntityTag, as: 'tags' } ]
      };

      return Entity.findOne(query);
    }

  }
});

module.exports = Entity;