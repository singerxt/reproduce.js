
'use strict';

var request = require('request');

/**
 * Routes
 */
var routes = [];

/**
 * GET /
 * Version: 1.0.0
 */

routes.push({
  meta: {
    name: 'getRoot',
    method: 'GET',
    paths: [
      '/'
    ],
    version: '1.0.0'
  },
  middleware: function(req, res, next) {
    request.get('http://x-team.com', function (error, response, body) {
      res.send({
        foo: body
      });
      return next();
    });
  }
});

/**
 * Export
 */

module.exports = routes;
