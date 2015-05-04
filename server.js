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

/**
 * Create all tables in sqlite
 * @return {Promise}
 */
function initTables() {
  return Models.db.sync();
}

/**
 * Start express http server
 * @return {Promise}
 */
function startServer() {
  return new Promise(function (resolve, reject) {
    app.listen(config.get('port'), function(err) {
      if (err) return reject(err);
      resolve();
    });
  })
}

initTables()
.then(startServer)
.then(function() {
  winston.info("Tagger started on port "+config.get('port'));
})
.catch(function() {
  winston.error(err);
  return winston.info("Tagger failed to start");
});