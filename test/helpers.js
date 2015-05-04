var _ = require('lodash');
var request = require('request');
var config = require('../config');
var helpers = {};

helpers.makeUrl = function(path) {
  var url = require('url');
  return url.format({
    protocol: 'http',
    port: config.get('port'),
    hostname: '127.0.0.1',
    pathname: path
  });
}

/*
 * Make a request to the Tagger api
 * 
 * @param {String} request method
 * @param {String} api request path
 * @param {Object} data used in request
 * @param {Function} callback
 */
helpers.makeRequest = function(method, path, data, cb) {
  method = method || 'GET';
  body = null;

  if (_.isFunction(data)) {
    cb = data;
    data = {};
  };

  var headers = {
    'Accept': 'application/json'
  };

  if (['POST', 'PUT'].indexOf(method) > -1) {
    headers['Content-Type'] = 'application/json',
    body = JSON.stringify(data);
  }

  var uri = helpers.makeUrl(path);
  var options = {
    uri: uri,
    method: method,
    headers: headers,
    body: body
  }; 

  return request(options, function(err, res, body) {
    if (err) return cb(err);
    
    if (res.statusCode === 500) {
      console.log(res.body);
    }

    if (body && res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') > -1) {
      body = JSON.parse(body);
    }

    return cb(err, res, body);
  });
}

module.exports = helpers;