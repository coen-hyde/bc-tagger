'use strict';

var _ = require('lodash');
var findById = require('./findById');
var Models = require('../models');
var Entity = Models.entity;
var EntityTag = Models['entity-tag'];

var findEntity = function(options) {
  var options = options || {};
  _.defaults(options, {
    strict: true
  });

  return function(req, res, next) {
    var type = req.params.entityType;
    var id = req.params.entityId;
    if (typeof type === 'undefined' || typeof id === 'undefined') {
      return res.status(400).send('entity type and entity id are required');
    }

    // Cast id as integer
    id = parseInt(id, 10);

    var query = {
      where: { type: type, foreignId: id },
      include: [ { model: EntityTag, as: 'tags' } ]
    };

    Models.entity.findOne(query).nodeify(function(err, entity) {
      if (err) return next(err);
      if (entity) {
        res.locals.entity = entity;
      }
      else if (options.strict) {
        // If strict option is on. Then return 404 when record is not found
        return res.status(404).send();
      }
      next();
    });
  };

  return findById(Models.entity, 'entityId', options);
}

module.exports = findEntity;