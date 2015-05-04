'use strict';

var Sequelize = require('Sequelize');
var db = require('../db');

var EntityTag = db.define('EntityTag', {
  tag: Sequelize.STRING
}, {
  classMethods: {
    /*
     * Get tag stats
     *
     * @return {Promise}
     */
    stats: function(id) {
      var query = {
        attributes: [
          'tag',
          [db.fn('count', db.col('id')), 'count']
        ], 
        group: ['tag']
      };

      if (id) {
        query.where = { 'EntityId': id };
      }

      return EntityTag.findAll(query);
    }
  }
});

module.exports = EntityTag;