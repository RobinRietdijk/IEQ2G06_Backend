"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.emitError = emitError;
exports.trimSocket = trimSocket;
var _logger = require("../utils/logger");
var _constants = require("../utils/constants");
function emitError(socket, error) {
  var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
  _logger.socketioLogger.warn(error, JSON.parse(trimSocket(socket)));
  socket.emit(_constants.EVENTS.ERROR, {
    msg: error
  });
  callback();
}
function trimSocket(socket) {
  var args = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return JSON.stringify(Object.assign({
    id: socket.id,
    pid: socket.pid,
    url: socket.url,
    status: socket.recovered ? 'Recovered' : socket.connected ? 'Connected' : 'Disconnected',
    remote_addr: socket.handshake.address || '',
    user_agent: socket.handshake.headers['user-agent'] || '',
    referer: socket.handshake.headers.referer || ''
  }, args));
}