'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  pattern: String,
  regularExpression: Boolean
  
});

module.exports = mongoose.model('Thing', ThingSchema);