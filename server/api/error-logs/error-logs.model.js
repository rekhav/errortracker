'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ErrorLogsSchema = new Schema({
  name: String,
  description: String,
  stacktrace: String,
  status: String,
  buildVersion: String,
  buildRelease: String,
  rfcCreated: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ErrorLogs', ErrorLogsSchema);