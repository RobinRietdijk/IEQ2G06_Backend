"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
function _classPrivateFieldInitSpec(obj, privateMap, value) { _checkPrivateRedeclaration(obj, privateMap); privateMap.set(obj, value); }
function _checkPrivateRedeclaration(obj, privateCollection) { if (privateCollection.has(obj)) { throw new TypeError("Cannot initialize the same private elements twice on an object"); } }
function _classPrivateFieldGet(receiver, privateMap) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get"); return _classApplyDescriptorGet(receiver, descriptor); }
function _classApplyDescriptorGet(receiver, descriptor) { if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }
function _classPrivateFieldSet(receiver, privateMap, value) { var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set"); _classApplyDescriptorSet(receiver, descriptor, value); return value; }
function _classExtractFieldDescriptor(receiver, privateMap, action) { if (!privateMap.has(receiver)) { throw new TypeError("attempted to " + action + " private field on non-instance"); } return privateMap.get(receiver); }
function _classApplyDescriptorSet(receiver, descriptor, value) { if (descriptor.set) { descriptor.set.call(receiver, value); } else { if (!descriptor.writable) { throw new TypeError("attempted to set read only private field"); } descriptor.value = value; } }
var _socket = /*#__PURE__*/new WeakMap();
var _id = /*#__PURE__*/new WeakMap();
var _data = /*#__PURE__*/new WeakMap();
var _changed = /*#__PURE__*/new WeakMap();
var _root = /*#__PURE__*/new WeakMap();
var _connectedSince = /*#__PURE__*/new WeakMap();
var _disconnectedSince = /*#__PURE__*/new WeakMap();
var Node = exports["default"] = /*#__PURE__*/function () {
  function Node(id, root) {
    _classCallCheck(this, Node);
    _classPrivateFieldInitSpec(this, _socket, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _id, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _data, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _changed, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _root, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _connectedSince, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldInitSpec(this, _disconnectedSince, {
      writable: true,
      value: void 0
    });
    _classPrivateFieldSet(this, _id, id);
    _classPrivateFieldSet(this, _root, root);
    _classPrivateFieldSet(this, _data, null);
    _classPrivateFieldSet(this, _changed, false);
    _classPrivateFieldSet(this, _connectedSince, null);
    _classPrivateFieldSet(this, _disconnectedSince, null);
  }
  _createClass(Node, [{
    key: "getSocket",
    value: function getSocket() {
      return _classPrivateFieldGet(this, _socket);
    }
  }, {
    key: "getId",
    value: function getId() {
      return _classPrivateFieldGet(this, _id);
    }
  }, {
    key: "isConnected",
    value: function isConnected() {
      if (!_classPrivateFieldGet(this, _socket)) return false;
      return _classPrivateFieldGet(this, _socket).connected;
    }
  }, {
    key: "isRoot",
    value: function isRoot() {
      return _classPrivateFieldGet(this, _root);
    }
  }, {
    key: "setData",
    value: function setData(data) {
      _classPrivateFieldSet(this, _data, data);
      _classPrivateFieldSet(this, _changed, true);
    }
  }, {
    key: "getData",
    value: function getData() {
      _classPrivateFieldSet(this, _changed, false);
      return _classPrivateFieldGet(this, _data);
    }
  }, {
    key: "hasChanged",
    value: function hasChanged() {
      return _classPrivateFieldGet(this, _changed);
    }
  }, {
    key: "connect",
    value: function connect(socket) {
      _classPrivateFieldSet(this, _socket, socket);
      _classPrivateFieldSet(this, _connectedSince, new Date());
      _classPrivateFieldSet(this, _disconnectedSince, null);
    }
  }, {
    key: "disconnect",
    value: function disconnect() {
      _classPrivateFieldSet(this, _socket, null);
      _classPrivateFieldSet(this, _connectedSince, null);
      _classPrivateFieldSet(this, _disconnectedSince, new Date());
    }
  }, {
    key: "getConnectedSince",
    value: function getConnectedSince() {
      if (!this.isConnected()) throw new Error("Node is not connected");
      return _classPrivateFieldGet(this, _connectedSince);
    }
  }, {
    key: "getDisconnectedSince",
    value: function getDisconnectedSince() {
      if (this.isConnected()) throw new Error("Node is still connected");
      return _classPrivateFieldGet(this, _disconnectedSince);
    }
  }]);
  return Node;
}();