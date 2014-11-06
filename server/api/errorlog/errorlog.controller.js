/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /errorLogs              ->  index
 * POST    /errorLogs              ->  create
 * GET     /errorLogs/:id          ->  show
 * PUT     /errorLogs/:id          ->  update
 * DELETE  /errorLogs/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var ErrorLog = require('./errorlog.model');

// Get list of errorLogs
exports.index = function(req, res) {
  ErrorLog.find(function (err, errorLogs) {
    if(err) { return handleError(res, err); }
    return res.json(200, errorLogs);
  });
};

// Get a single errorLog
exports.show = function(req, res) {
  var query = req.params.id;
  switch(query) {
    case 'status':
      ErrorLog.find({status : req.params.value}, function (err, errorLogs) {
        if(err) { return handleError(res, err); }
        if(!errorLogs) { return res.send(404); }
        return res.json(errorLogs);
      });
      break;
    case 'buildVersion':
      ErrorLog.find({buildVersion : req.params.value}, function (err, errorLogs) {
        if(err) { return handleError(res, err); }
        if(!errorLogs) { return res.send(404); }
        return res.json(errorLogs);
      });
      break;
    default:
      console.log("request is not valid");
      break;
  }  
};

// Creates a new errorLog in the DB.
exports.create = function(req, res) {
  ErrorLog.create(req.body, function(err, errorLog) {
    if(err) { return handleError(res, err); }
    return res.json(201, errorLog);
  });
};

// Updates an existing errorLog in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  ErrorLog.findById(req.params.id, function (err, errorLog) {
    if (err) { return handleError(res, err); }
    if(!errorLog) { return res.send(404); }
    var updated = _.merge(errorLog, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, errorLog);
    });
  });
};

// Deletes a errorLog from the DB.
exports.destroy = function(req, res) {
  ErrorLog.findById(req.params.id, function (err, errorLog) {
    if(err) { return handleError(res, err); }
    if(!errorLog) { return res.send(404); }
    errorLog.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}