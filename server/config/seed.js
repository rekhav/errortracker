/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model'),
    ErrorLog = require('../api/errorlog/errorlog.model');



// Thing.find({}).remove(function() {
//   console.log('');
// });

ErrorLog.find({}).remove(function(){
  console.log("removing data");
});