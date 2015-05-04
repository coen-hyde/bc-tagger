'use strict';

var _ = require('lodash');
var findEntity = require('./findEntity')({strict: false});
var Models = require('../models');
var Entity = Models.entity;
var EntityTag = Models['entity-tag'];

var findOrCreateEntity = function() {
  return function(req, res, next) {
    findEntity(req, res, function(err) {
      if (err || res.locals.entity) return next(err);
      
      var type = req.params.entityType;
      var id = parseInt(req.params.entityId, 10);

      Entity
        .create({ type: type, foreignId: id })
        .then(function(entity) {
          res.locals.entity = entity;
          res.locals.entityCreated = true;
          return next();
        })
        .catch(next)
    });
  };
}

module.exports = findOrCreateEntity;