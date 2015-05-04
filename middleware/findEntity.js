var findById = require('./findById');
var Models = require('../models');

var findEntity = function(options) {
  options = options || {};
  options.include = [ { model: Models['entity-tag'], as: 'tags' } ]
  return findById(Models.entity, 'entityId', options);
}

module.exports = findEntity;