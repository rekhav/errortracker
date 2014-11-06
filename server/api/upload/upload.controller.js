/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash'),
   fs = require('fs'),
   Transform = require('stream').Transform,
   multiparty = require("multiparty"),
   csv = require('csv-streamify'),
   JSONStream = require('JSONStream'),
   ErrorLog = require('../errorlog/errorlog.model');

var getFormattedTrace = function(stackTrace) {
  var trace = '';
  if(!_.isUndefined(stackTrace)) {
    trace = stackTrace;
    trace = stackTrace.replace(/\/r/g, "").replace(/\/t/g, "");
    return trace;
  }
  return '';
};

var getCompleteStackTrace = function(data) {
  //except for first and last record , add the rest with new line character which forms the complete stacktrace.
  var stackTrace = data;
  stackTrace.splice(0, 1);
  stackTrace.splice(stackTrace.length-1, 1);  
  return stackTrace.join('\n');
};

var getDescription = function(fullStackTrace) {
  var stackTrace = fullStackTrace;
  if(_.isString(stackTrace)) {
    var splittedArray = stackTrace.split('\\n\\t');
    console.log(splittedArray[0]);
    return splittedArray[0];
  }
  return '';
};

var storeErrorLogInDb = function (ErrorLog_data, data) {
  var errorLog = new ErrorLog(ErrorLog_data);
    ErrorLog.findOne({'description': data[1]}, function (err, doc) {
      if (err) { console.log("find error"); }
      if(!doc) { 
        ErrorLog.create(errorLog, function(err, newLog) {
          if(err) { console.log("error adding new log"); }
          console.log("new log added");
        });
      } else {
        var now = new Date();
        ErrorLog.update({id: doc.id}, {$set: {'lastUpdated'  : now},}, function(error) {
          if(error) {console.log("update not successful" + error);}
        });              
      }              
        
    });   
};

var parserCsvFile = function(files, res) {
      var dataFile = fs.createReadStream(files.file[0].path);
      var options = {
        delimiter: ',',
        objectMode: true,
        newline: '\n\t',
        quote : '\"'
      }
      var csvToJson = csv(options);

      var parser = new Transform(options);
        parser.header = null;
        parser._rawHeader = [];
        parser._transform = function(data, encoding, done) {
        if (!this.header) {
          this._rawHeader.push(data);
          if (data[0] === 'class') {
            // This is the header and ignore the original header
            this.header = ['name', 'description', 'stacktrace', 'status', 'buildVersion', 'buildRelease', 'rfcCreated'];            
            
          }
        }
        // After parsing the header, push data rows
        else {
         // if(data[2]) {
            console.log("data[2] " + data[2]);            
            if(data.length > 3) {
              var name = data[0],
                description = getDescription(data[1]),
                stackTrace = getCompleteStackTrace(data); 
              data[0] = name;            
              data[1] = description;     
              data[2] =  stackTrace;
                     
            } else {
              data[2] =  getFormattedTrace(data[1]);
              data[1] = getDescription(data[1]);
              
            }         
            var ErrorLog_data = {name: data[0], description: data[1], stacktrace: data[2], status: 'OPEN', buildVersion: '', buildRelease: '', rfcCreated: false};
             storeErrorLogInDb(ErrorLog_data, data);      
            this.push(ErrorLog_data);
          //}
        }
        done();
      };

      var jsonToStrings = JSONStream.stringify(false);
      
      res.setHeader('Content-Type', 'application/json');
      dataFile
      .pipe(csvToJson)
      .pipe(parser)
      .pipe(jsonToStrings)    
      .pipe(res);    
};

// upload the csv file
exports.uploadFile = function(req, res, next) {      
   var form = new multiparty.Form();
   // Parse req

    form.parse(req, function(err, fields, files) {
      Object.keys(fields).forEach(function(name) {
        });

      Object.keys(files).forEach(function(name) {
        });

    parserCsvFile(files, res);
    
  });
    
};