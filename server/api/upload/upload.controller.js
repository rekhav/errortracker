/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var multipart = require("multipart");
//var Thing = require('./thing.model');

// Get list of things
exports.uploadFile = function(req, res) {
      console.log("received files: " + req.body.files);
     return res.send(200, "reached service");
};

function handleError(res, err) {
  return res.send(500, err);
}