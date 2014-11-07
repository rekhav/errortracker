'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    date = new Date();
	date.setDate(date.getDate() - 1);

var ErrorLogSchema = new Schema({
  description: String,
  stacktrace: String,
  status: String,
  count: String,
  system: String,
  remark: String,
  buildVersion: String,
  buildRelease: String,  
  lastUpdated: { type: Date, default: Date.now },
  lastOccured: { type: Date, default: date }
});

module.exports = mongoose.model('ErrorLog', ErrorLogSchema);