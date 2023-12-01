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
var _Node = _interopRequireDefault(require("./Node"));
var _constants = require("../utils/constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function connection(ioc, socket, data) {
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
  if (ioc.node_clients[socket.id]) {
    var node = ioc.node_clients[socket.id];
    node.disconnect();
    delete ioc.node_clients[socket.id];
  }
}
function nodeConnect(ioc, socket, data) {
  var node_id = data.node_id,
    system_id = data.system_id,
    root = data.root,
    node_data = data.data;
  if (!node_id || !system_id) {
    (0, _utils.emitError)(socket, InvalidRequestError('Invalid request data'));
    return;
  }
  var node = ioc.nodes[node_id];
  if (!node) node = new _Node["default"](node_id, root);
  if (node.isConnected()) {
    (0, _utils.emitError)(socket, InvalidRequestError('Node already connected'));
    return;
  }
  node.connect(socket);
  node.setData(node_data);
  ioc.node_clients[socket.id] = node;
  socket.join(system_id);
  socket.emit(_constants.EVENTS.NODE_CONNECTED, {
    server_ups: _constants.UPS
  });
}
function nodeData(ioc, socket, data) {
  var node_data = data.data;
  if (!node_data) {
    (0, _utils.emitError)(socket, InvalidRequestError('Invalid request data'));
    return;
  }
  ioc.node_clients[socket.id].setData(node_data);
}