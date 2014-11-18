/**
 * Using Rails-like standard naming convention for endpoints.
 * POST    /uploadcsv              ->  upload 
 */

'use strict';

var _ = require('lodash'),
   fs = require('fs'),
   Transform = require('stream').Transform,
   multiparty = require("multiparty"),
   csv = require('csv-streamify'),
   JSONStream = require('JSONStream'),
   ErrorLog = require('../errorlog/errorlog.model'),
   Thing = require('../thing/thing.model'),
   excludePatterns = [];

var getFormattedTrace = function(stackTrace) {
  var trace = '';
  if(!_.isUndefined(stackTrace) && stackTrace.indexOf('\\n\\t') > -1) {
    trace = stackTrace;    
    trace = stackTrace.replace(/\\t/g, '').replace(/\\n/g, '\n');
    trace = 'Stack trace: ' + trace;
    return trace.length > 5000 ? trace.substring(0, 5000) : trace;
  }
  return '';
};

var getCompleteStackTrace = function(data) {
  //except for first and last record , add the rest with new line character which forms the complete stacktrace.
  var stackTrace = data;
  stackTrace.splice(0, 1);
  stackTrace.splice(stackTrace.length-1, 1);  
  stackTrace = stackTrace.join(',');
  return getFormattedTrace(stackTrace);  
};

var getDescription = function(fullStackTrace) {
  var stackTrace = fullStackTrace;
  if(_.isString(stackTrace)) {
    var splittedArray = stackTrace.split('\\n\\t'); 
    var description =  splittedArray[0];
    if(description.length > 1000) {
        description = description.substring(0, 100) + '... ' + description.substring(description.length-600);
    }    
    return description.replace(/\\t/g, '').replace(/\\n/g, '').replace(/"/g, '');
  }
  return '';
};

var storeErrorLogInDb = function (ErrorLog_data) {
  var errorLog = new ErrorLog(ErrorLog_data);
  ErrorLog.findOne({description: ErrorLog_data.description}, function (err, doc) {
      if (err) { console.log("find error"); }
      if(!doc) {
        ErrorLog.create(errorLog, function(err, newLog) {
          if(err) { console.log("error adding new log" + err); } 
          console.log("log not found so adding a new one");         
        });
      } else {
        var now = new Date();
        ErrorLog.update({_id: doc._id}, {$set: {'lastUpdated' : now, 'count' : ErrorLog_data.count},}, function(error) {
          if(error) {console.log("update not successful ");}
          console.log("log found so updating an existing one");       
        });              
      }              
        
    });   
};

var isExcludedPattern = function(description) {
  var patterns = _.pluck(excludePatterns, 'pattern');
  var found = false;
  for (var i = 0; i < patterns.length && !found; i++) {
    if (_.contains(description, patterns[i])) {
      found = true;
    }
  }
  return found;
}

var parserCsvFile = function(files, res) {
      var dataFile = fs.createReadStream(files.file[0].path);
      var options = {
        delimiter: ',',
        objectMode: true,
        newline: '\n\t',
        quote : '\"'
      }

      Thing.find(function (err, things) {
        if(err) { console.log('error occured while getting exclude patterns'); }
        excludePatterns = things;
      });

      var csvToJson = csv(options);

      var parser = new Transform(options);
        parser.header = null;
        parser.row = [];
        parser._transform = function(data, encoding, done) {
        if (!this.header) {
          //this._rawHeader.push(data);
          if (data[0] === 'class') {
            // This is the header and ignore the original header
            this.header = ['name', 'description', 'stacktrace', 'status', 'buildVersion', 'buildRelease', 'rfcCreated'];            
            
          }
        }
        // After parsing the header, push data rows
        else {
         if(_.isString(data[1]) && data[1] !== '' && !_.isUndefined(data[2])) {
            if(data.length > 3) {
              var description = getDescription(data[1]),
                  stackTrace = getCompleteStackTrace(data);
              data[2] = data[data.length-1]; 
              data[1] = description;     
              data[3] =  stackTrace;
                     
            } else {
              data[3] = getFormattedTrace(data[1]);
              data[1] = getDescription(data[1]);
              
            }  
            var count = data[2].replace(/\\r/g, ''); 
            var ErrorLog_data = {description: data[1], stacktrace: data[3], count: count, status: 'NEW', remark: '',system: '', buildVersion: '', buildRelease: ''};
            var patterns = _.pluck(excludePatterns, 'pattern');
            if(!isExcludedPattern(ErrorLog_data.description)) {
              storeErrorLogInDb(ErrorLog_data);      
              this.push(ErrorLog_data);
              this.row.push(ErrorLog_data); 
            }           
          }
        }
        done(); 
      };

      var jsonToStrings = JSONStream.stringify(false);
      
      res.setHeader('Content-Type', 'text/plain');
      dataFile
      .pipe(csvToJson)
      .pipe(parser)
      .pipe(jsonToStrings)    
      .pipe(res);
      res.write("passed successfully");      
};

// upload the csv file
exports.uploadFile = function(req, res, next) {      
   var form = new multiparty.Form();
   // Parse req
    form.parse(req, function(err, fields, files) {      
      parserCsvFile(files, res);
    
    });    
};