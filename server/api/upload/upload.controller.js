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
   JSONStream = require('JSONStream');

// Get list of things
exports.uploadFile = function(req, res, next) {      
   var form = new multiparty.Form();
   // Parse req

    form.parse(req, function(err, fields, files) {
      Object.keys(fields).forEach(function(name) {
        console.log('got field named ' + name);
      });

      Object.keys(files).forEach(function(name) {
        console.log('got file named ' + name);
      });

    console.log('Upload completed!');
    parserCsvFile(files, res);
    
  });
    
};


var parserCsvFile = function(files, res) {
      var dataFile = fs.createReadStream(files.file[0].path);
      var options = {
        delimiter: ';',
        objectMode: true
      }
      var csvToJson = csv(options);

      var parser = new Transform(options);
        parser.header = null;
        parser._rawHeader = [];
        parser._transform = function(data, encoding, done) {
        if (!this.header) {
          console.log("inside header" + data[0]);
          this._rawHeader.push(data);
          if (data[0] === 'name') {
            // We reached the last line of the header
            this.header = ['name', 'description', 'stacktrace', 'status', 'buildVersion', 'buildRelease', 'rfcCreated'];            
            this.push({header: this.header});
          }
        }
        // After parsing the header, push data rows
        else {
          if(data.length > 3) {
            var stackTrace = getCompleteStackTrace(data); 
            data[1] = data[1] + '\n' + data[2];            
            data = [data[0], data[1], stackTrace , 'OPEN', '', '', false];               
          }
          this.push({row: data});
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
}

var getCompleteStackTrace = function(data) {
  var stackTrace = '';
  for(var i=1; i < data.length-1; i++) {
      stackTrace = stackTrace + '\n' + data[i];
  }
  return stackTrace;
}