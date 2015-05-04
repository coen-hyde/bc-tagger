'use strict';

var _ = require('lodash');
var express = require('express');
var Models = require('../models');
var mw = require('../middleware');
var router = new express.Router();

/*
 * Fetch an entity and it's tags
 */
router.get('/:entityId', mw.findEntity({strict: true}), function(req, res, next) {
  res.json(res.locals.entity.public());
});

module.exports = router;