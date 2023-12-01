"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _socket = require("socket.io");
var _constants = require("../utils/constants");
var _adminUi = require("@socket.io/admin-ui");
var _logger = require("../utils/logger");
var _handlers = _interopRequireDefault(require("./handlers"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateMethodInitSpec(obj, privateSet) { _checkPrivateRedeclaration(obj, privateSet); privateSet.add(obj); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }
function _classStaticPrivateFieldSpecSet(receiver, classConstructor, descriptor, value) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
function _classStaticPrivateFieldSpecGet(receiver, classConstructor, descriptor) { _classCheckPrivateStaticAccess(receiver, classConstructor); _classCheckPrivateStaticFieldDescriptor(descriptor, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classCheckPrivateStaticFieldDescriptor(descriptor, action) { if (descriptor === undefined) { throw new TypeError("attempted to " + action + " private static field before its declaration"); } }
function _classCheckPrivateStaticAccess(receiver, classConstructor) { if (receiver !== classConstructor) { throw new TypeError("Private static access of wrong provenance"); } }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
var DEFAULT_OPTIONS = {
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
    skipMiddlewares: true,
    credentials: true
  },
  cors: {
    origin: '*'
  }
};
var _initListeners = /*#__PURE__*/new WeakSet();
var _checkChangedData = /*#__PURE__*/new WeakSet();
var _checkRoomChangedData = /*#__PURE__*/new WeakSet();
var _initDataLoop = /*#__PURE__*/new WeakSet();
var SocketController = exports["default"] = /*#__PURE__*/function () {
  function SocketController() {
    _classCallCheck(this, SocketController);
    _classPrivateMethodInitSpec(this, _initDataLoop);
    _classPrivateMethodInitSpec(this, _checkRoomChangedData);
    _classPrivateMethodInitSpec(this, _checkChangedData);
    _classPrivateMethodInitSpec(this, _initListeners);
    if (!_classStaticPrivateFieldSpecGet(SocketController, SocketController, _instance)) _classStaticPrivateFieldSpecSet(SocketController, SocketController, _instance, this);
    return _classStaticPrivateFieldSpecGet(SocketController, SocketController, _instance);
  }
  _createClass(SocketController, [{
    key: "initSocketController",
    value: function initSocketController(httpServer) {
      var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_OPTIONS;
      if (this.io) throw new Error('SocketController has already been initialized');
      this.io = new _socket.Server(httpServer, opts);
      (0, _adminUi.instrument)(this.io, {
        auth: false,
        mode: _constants.NODE_ENV
      });
      _classPrivateMethodGet(this, _initListeners, _initListeners2).call(this);
      _classPrivateMethodGet(this, _initDataLoop, _initDataLoop2).call(this);
      this.connections = 0;
      this.node_clients = {};
      this.nodes = {};
    }
  }, {
    key: "isInitialized",
    value: function isInitialized() {
      return Boolean(this.io);
    }
  }, {
    key: "emitTo",
    value: function emitTo(room, event, data) {
      if (!this.isInitialized()) throw new Error('SocketController has not been initiated yet');
      this.io.to(room).emit(event, data);
    }
  }]);
  return SocketController;
}();
function _initListeners2() {
  var _this = this;
  this.io.on(_constants.EVENTS.CONNECTION, function (socket) {
    _handlers["default"].connection(_this, socket, {});
    socket.on(_constants.EVENTS.DISCONNECT, function (data) {
      return _handlers["default"].disconnect(_this, socket, data);
    });
    socket.on(_constants.EVENTS.NODE_CONNECT, function (data) {
      return _handlers["default"].nodeConnect(_this, socket, data);
    });
    socket.on(_constants.EVENTS.NODE_DATA, function (data) {
      return _handlers["default"].nodeData(_this, socket, data);
    });
  });
}
function _checkChangedData2() {
  var rooms = this.io.sockets.adapter.rooms;
  for (var room in rooms) if (room) _classPrivateMethodGet(this, _checkRoomChangedData, _checkRoomChangedData2).call(this, room);
}
function _checkRoomChangedData2(room) {
  var socketsInRoom = this.io.sockets.adapter.rooms[room].sockets;
  var systemPackage = {};
  var changed = false;
  for (var socketId in socketsInRoom) {
    var node = this.node_clients[socketId];
    if (node) {
      if (node.hasChanged()) changed = true;
      systemPackage[node.getId()] = node.getData();
    }
  }
  if (changed) this.emitTo(room, _constants.EVENTS.SYSTEM_DATA, {
    system_data: systemPackage
  });
}
function _initDataLoop2() {
  var _this2 = this;
  setInterval(function () {
    try {
      _classPrivateMethodGet(_this2, _checkChangedData, _checkChangedData2).call(_this2);
    } catch (error) {
      _logger.appLogger.error(error);
    }
  }, 1000 / _constants.UPS);
}
var _instance = {
  writable: true,
  value: void 0
};