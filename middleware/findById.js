'use strict';

var _ = require('lodash');

/*
 * Middleware to find a db record 
 *
 * @param {Object} Model to search
 * @param {String} Name of named url param
 * @param {Object} An object with options
 * @param {Boolean} [options.strict=true] Return 404 if record isn't found
 */ 
var findById = function(model, param, options) {
  _.defaults(options, {
    strict: false
  });

  return function(req, res, next) {
    var id = req.params[param];
    if (typeof id === 'undefined') {
      return res.status(400).send(param+' must exist');
    }

    id = parseInt(id, 10);
    var args = [id];

    if (options.include) {
      args.push({include: options.include});
    }

    model.find.apply(model, args).nodeify(function(err, record) {
      if (err) return next(err);
      if (record) {
        var modelName = model.name.toLowerCase();
        res.locals[modelName] = record;
      }
      else if (options.strict) {
        // If strict option is on. Then return 404 when record is not found
        return res.status(404).send();
      }
      next();
    });
  }
}

module.exports = findById;