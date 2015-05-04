var Promise = require('bluebird');
var async = require('async');
var _ = require('lodash');
var db = require('../../db');
var Models = require('../../models');

var data = {};

data['entity'] = [
  {
    id: 1,
    type: 'product',
    foreignId: 50
  }
];

data['entity-tag'] = [
  {
    EntityId: 1,
    tag: 'Electronic'
  },
  {
    EntityId: 1,
    tag: 'Entertainment'
  }
];

module.exports = {
  reload: function(cb) {
    Promise.map(_.keys(Models), function(modelName) {
      var model = Models[modelName];
      return model.sync({force: true}).then(function() {
        return model.bulkCreate(data[modelName]);
      });
    })
    .nodeify(cb);
  },
  data: data
};