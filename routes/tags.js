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
 * Create or update an entity with tags
 */
entityRoute.post(function(req, res, next) {
  var type = req.params.entityType;
  var id = req.params.entityId;
  var tags = req.body.tags || [];

  // Make sure we have an entity tyoe and id
  if (typeof type === 'undefined' || typeof id === 'undefined') {
    return res.status(400).send('entity type and entity id are required');
  }

  // unless must be an array
  if (!_.isArray(tags)) {
    return res.status(400).send('tags must be an array');
  }

  Entity.updateTags(type, id, tags, function(err, entity) {
    if (err) return next(err);

    res.status(201).json(entity.sanitize());
  });
});


module.exports = router;