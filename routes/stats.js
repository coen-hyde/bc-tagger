'use strict';

var Sequelize = require('Sequelize');
var express = require('express');
var Models = require('../models');
var db = require('../db');
var mw = require('../middleware');
var Entity = Models.entity;
var EntityTag = Models['entity-tag'];

var router = new express.Router();

router.get('/', function(req, res, next) {
  EntityTag.stats().nodeify(function(err, results) {
    res.json(results);
  });
});


router.get('/:entityType/:entityId', mw.findEntity(), function(req, res, next) {
  var entity = res.locals.entity;
  EntityTag.stats(entity.id).nodeify(function(err, results) {
    res.json(results);
  });
});



module.exports = router;