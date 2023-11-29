"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connection = connection;
exports.disconnect = disconnect;
exports.nodeConnect = nodeConnect;
exports.nodeData = nodeData;
var _utils = require("./utils");
var _logger = require("../utils/logger");
function connection(ioc, socket) {
  _logger.socketioLogger.info('Connected', JSON.parse((0, _utils.trimSocket)(socket)));
  socket.onAny(function (event) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    _logger.socketioLogger.event('<<', JSON.parse((0, _utils.trimSocket)(socket, {
      event: event,
      args: args
    })));
  });
  socket.onAnyOutgoing(function (event) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    _logger.socketioLogger.event('>>', JSON.parse((0, _utils.trimSocket)(socket, {
      event: event,
      args: args
    })));
  });
  ioc.connections += 1;
}
function disconnect(ioc, socket, data) {
  _logger.socketioLogger.info('Disconnected', JSON.parse((0, _utils.trimSocket)(socket, {
    reason: data
  })));
  ioc.connections -= 1;
}
function nodeConnect(ioc, socket, data) {}
function nodeData(ioc, socket, data) {}