'use strict';

var _ = require('lodash');
var express = require('express');
var Models = require('../models');
var mw = require('../middleware');
var router = new express.Router();

var findEntity = _.partial(mw.findById, Models.entity, 'entityId');

/*
 * Fetch an entity and it's tags
 */
router.get('/:entityId', findEntity({strict: true}), function(req, res, next) {
  res.json(res.locals.entity);
});

module.exports = router;