/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var errorLogs = require('./error-logs.model');

exports.register = function(socket) {
  errorLogs.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  errorLogs.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('errorLogs:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('errorLogs:remove', doc);
}