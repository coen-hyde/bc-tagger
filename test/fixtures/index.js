var async = require('async');
var _ = require('lodash');
var db = require('../../db');
var Models = require('../../models');

var data = {};

data.tags = [
  
];

module.exports = {
  reload: function(cb) {
    _.each(Models, function(model, modelName, next) {
      model.sync({force: true}).bulkCreate(data[modelName]).nodify(next);
    }, cb);
  }
};