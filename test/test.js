"use strict";

var mocha = require('mocha');
var expect = require('expect.js');
var request = require('request');
var config = require('../config');
var server = require('../server');
var fixtures = require('./fixtures');
var helpers = require('./helpers');
var makeRequest = helpers.makeRequest;

before(function(done) {
  server.start(done);
});

beforeEach(function(done) {
  fixtures.reload(done);
});

describe('Tags', function() {
  it('should return status 200 and entity data when requesting GET /tags/:entity', function(done) {
    makeRequest('GET', '/tags/50', function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      done();
    });
  });
});

describe('Stats', function() {

});