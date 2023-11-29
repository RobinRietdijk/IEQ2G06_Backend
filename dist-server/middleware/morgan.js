"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseLogger = exports.requestLogger = void 0;
var _morgan = _interopRequireDefault(require("morgan"));
var _logger = require("../utils/logger");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var requestLogger = exports.requestLogger = (0, _morgan["default"])(function (tokens, req, res) {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length') || '-',
    response_time: Number.parseFloat(tokens['response-time'](req, res)),
    remote_addr: tokens['remote-addr'](req, res) || '-',
    remote_user: tokens['remote-user'](req, res) || '-',
    http_version: tokens['http-version'](req, res),
    user_agent: tokens['user-agent'](req, res),
    referer: tokens.referrer(req) || '-'
  });
}, {
  stream: {
    write: function write(message) {
      var data = JSON.parse(message);
      _logger.httpLogger.http("<<", data);
    }
  }
});
var responseLogger = exports.responseLogger = (0, _morgan["default"])(function (tokens, req, res) {
  return JSON.stringify({
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: Number.parseFloat(tokens.status(req, res)),
    content_length: tokens.res(req, res, 'content-length') || '-',
    response_time: Number.parseFloat(tokens['response-time'](req, res)),
    remote_addr: tokens['remote-addr'](req, res) || '-',
    remote_user: tokens['remote-user'](req, res) || '-',
    http_version: tokens['http-version'](req, res),
    user_agent: tokens['user-agent'](req, res),
    referer: tokens.referrer(req) || '-'
  });
}, {
  stream: {
    write: function write(message) {
      var data = JSON.parse(message);
      _logger.httpLogger.http(">>", data);
    }
  }
});