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
  describe('GET Entity Tags', function() {
    it('should return status 404 when requesting an entity that does not exist', function(done) {
      makeRequest('GET', '/tags/30', function(err, res, body) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });
    it('should return status 200 and entity data when requesting an entity that does exist', function(done) {
      makeRequest('GET', '/tags/50', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.type).to.equal('Product');
        expect(body.tags.length).to.equal(2);
        expect(body.tags).to.contain('Electronic');
        expect(body.tags).to.contain('Entertainment');
        done();
      });
    });
  });
});

describe('Stats', function() {

});