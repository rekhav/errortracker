'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ErrorLogSchema = new Schema({
  name: String,
  description: { type: String, unique: true },
  stacktrace: String,
  status: String,
  buildVersion: String,
  buildRelease: String,
  rfcCreated: String,
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ErrorLog', ErrorLogSchema);