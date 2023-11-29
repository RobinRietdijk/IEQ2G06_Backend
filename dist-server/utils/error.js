"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnauthorizedError = exports.InvalidRequestError = void 0;
var UnauthorizedError = exports.UnauthorizedError = function UnauthorizedError() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Insufficient privileges';
  return "Unauthorized: ".concat(msg);
};
var InvalidRequestError = exports.InvalidRequestError = function InvalidRequestError() {
  var msg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Invalid request data';
  return "Invalid request: ".concat(msg);
};