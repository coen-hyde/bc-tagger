"use strict";

var async = require('async');
var _ = require('lodash');
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
      makeRequest('GET', '/tags/product/30', function(err, res, body) {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });

    it('should return status 200 and entity data when requesting an entity that does exist', function(done) {
      makeRequest('GET', '/tags/product/50', function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.type).to.equal('product');
        expect(body.tags.length).to.equal(2);
        expect(body.tags).to.contain('Electronic');
        expect(body.tags).to.contain('Entertainment');
        done();
      });
    });
  });

  describe('POST Entity Tags', function() {
    it('should return status 201 when a new entity is created', function(done) {
      makeRequest('POST', '/tags/product/30', { tags: ['Music'] }, function(err, res, body) {
        expect(res.statusCode).to.equal(201);
        expect(body.type).to.equal('product');
        expect(body.tags.length).to.equal(1);
        expect(body.tags).to.contain('Music');
        done();
      });
    });

    it('should return status 200 when updating an entity', function(done) {
      makeRequest('POST', '/tags/product/50', { tags: ['Movie'] }, function(err, res, body) {
        expect(res.statusCode).to.equal(200);
        expect(body.type).to.equal('product');
        expect(body.tags.length).to.equal(1);
        expect(body.tags).to.contain('Movie');
        done();
      });
    });
  });

  describe('DELETE Entity Tags', function() {
    it('should return 204 and remove entity when deleting an entity', function(done) {
      async.series([
        function(next) {
          makeRequest('DELETE', '/tags/product/50',function(err, res, body) {
            expect(res.statusCode).to.equal(204);
            next();
          });
        },
        function(next) {
          makeRequest('GET', '/tags/product/50',function(err, res, body) {
            expect(res.statusCode).to.equal(404);
            next();
          });
        }
      ], done);
    });
  })
});

describe('Stats', function() {
  it('should return 200 and stats data when requesting /stats', function(done) {
    makeRequest('GET', '/stats',function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      expect(body.length).to.equal(2);
      var electronicTag = _.find(body, {tag: 'Electronic'});
      expect(electronicTag.count).to.equal(2);
      done();
    });
  });
  it('should return 200 and stats data when requesting stats about a specific entity', function(done) {
    makeRequest('GET', '/stats/product/50',function(err, res, body) {
      expect(res.statusCode).to.equal(200);
      expect(body.length).to.equal(2);
      var electronicTag = _.find(body, {tag: 'Electronic'});
      expect(electronicTag.count).to.equal(1);
      done();
    });
  });
});