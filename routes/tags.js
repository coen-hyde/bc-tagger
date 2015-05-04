'use strict';

var _ = require('lodash');
var express = require('express');
var Models = require('../models');
var Entity = Models.entity;
var EntityTag = Models['entity-tag'];
var mw = require('../middleware');

var router = new express.Router();
var entityRoute = router.route('/:entityType/:entityId');

/*
 * Fetch an entity and it's tags
 */
entityRoute.get(mw.findEntity(), function(req, res, next) {
  res.json(res.locals.entity.sanitize());
});

/*
 * Create or update a new entity with tags
 */
entityRoute.post(mw.findOrCreateEntity(), function(req, res, next) {
  var entity = res.locals.entity;
  var tags = req.body.tags || [];

  // tags must be an array
  if (!_.isArray(tags)) {
    return res.status(400).send('tags must be an array');
  }

  entity.updateTags(tags)
    .then(function() { 
      // Find the entity and eager load the tags
      return Entity.findByTypeAndId(entity.type, entity.foreignId);
    })
    .nodeify(function(err, entity) {
      if (err) return next(err);

      var status = 200;
      if (res.locals.entityCreated) status = 201;
      res.status(status).json(entity.sanitize());
    });

  // entity.updateTags(tags).nodeify(function(err) {
  //   if (err) return next(err);

  //   var status = 200;
  //   if (res.locals.entityCreated) status = 201;
  //   res.status(status).json(entity.sanitize());
  // });
});


module.exports = router;