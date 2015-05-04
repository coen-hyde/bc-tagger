'use strict';

var async = require('async');
var _ = require('lodash');
var winston = require('winston');
var express = require('express');
var Promise = require('bluebird');
var bodyParser = require('body-parser');

var config = require('./config');
var Models = require('./models');
var Routes = require('./routes');

// Create application
var app = express();
app.use(bodyParser.json());

// Add routes
app.use('/tags', Routes.tags);

// Call all 404
app.get('/*', function(req, res, next) {
  res.status(404).send();
});

/**
 * Create all tables in sqlite
 * @param {Function} callback
 */
function initTables(cb) {
  var Models = require('./models');
  var db = require('./db');
  return db.sync().nodeify(cb);
}

/**
 * Start express http server
 * @param {Function} callback
 */
function startHttpServer(cb) {
  app.listen(config.get('port'), cb);
}

module.exports = {
  app: app,
  start: function(cb) {
    if (!cb) cb = function(){};

    async.series([ initTables, startHttpServer ], function(err) {
      if (err) {
        winston.error(err);
        winston.info("Tagger failed to start");
      }
      else {
        winston.info("Tagger started on port "+config.get('port'));
      }
      
      return cb(err);
    });
  }
}
