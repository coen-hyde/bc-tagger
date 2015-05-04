'use strict';

var nconf = require('nconf');
nconf.file('config/default.json');

module.exports = nconf;