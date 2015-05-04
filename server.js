'use strict';

var async = require('async');
var winston = require('winston');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config');

// Create application
var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  res.send('Woo');
});

/**
 * Drop and recreate all tables
 * @param {Function} Callback
 */
function initTables(cb) {
  var Models = require('./models');
  Models.sequelize.sync({force: true}).complete(cb);
}

/**
 * Start express http server
 * @param {Function} Callback
 */
function startServer(cb) {
  app.listen(config.get('port'), cb);
}

async.series([
  initTables,
  startServer
], function(err) {
  if (err) {
    winston.error(err);
    return winston.info("Tagger failed to start");
  }

  winston.info("Tagger started on port "+config.get('port'));
});