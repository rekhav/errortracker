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
    ErrorLog.find({status : req.params.value}, function (err, errorLogs) {
        if(err) { return handleError(res, err); }
        if(!errorLogs) { return res.send(404); }
        return res.json(errorLogs);
    });     
  
};

// Updates an existing errorLog in the DB.
exports.update = function(req, res) {
  ErrorLog.update({_id: req.body.name._id},
   {$set: 
    {
      'lastUpdated'  : new Date(),
      'status' : req.body.name.status,
      'buildRelease': req.body.name.buildRelease,
      'buildVersion': req.body.name.buildVersion,
      'system': req.body.name.system,
      'remark': req.body.name.remark
      },
    }, function(error) {
        if(error) {return handleError(res, error);}
        console.log("log found so updating an existing one");
        
        ErrorLog.findById(req.body.name._id, function (err, errorLog) {
          if (err) { return handleError(res, err); }
          if(!errorLog) { return res.send(404); }  
          return res.json(200, errorLog);   
        });  
  });

};

// Deletes a errorLog from the DB.
exports.destroy = function(req, res) {
  ErrorLog.findById(req.params.name._id, function (err, errorLog) {
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