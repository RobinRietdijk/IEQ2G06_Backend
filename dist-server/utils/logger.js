"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socketioLogger = exports.httpLogger = exports.appLogger = void 0;
var _winston = _interopRequireDefault(require("winston"));
var _winstonDailyRotateFile = _interopRequireDefault(require("winston-daily-rotate-file"));
var _chalk = _interopRequireDefault(require("chalk"));
var _excluded = ["level", "message", "timestamp", "label"],
  _excluded2 = ["level", "message", "timestamp", "label"];
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
var format = _winston["default"].format;
var TIMESTAMP_COLOR = _chalk["default"].rgb(160, 160, 160);
var LABEL_COLOR = _chalk["default"].rgb(230, 190, 50);
var colors = {
  warn: 'yellow',
  http: 'cyan',
  event: 'cyan'
};
_winston["default"].addColors(colors);
var appLogFile = new _winston["default"].transports.DailyRotateFile({
  filename: './logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '3d'
});
var httpLogFile = new _winston["default"].transports.DailyRotateFile({
  filename: './logs/http-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '3d'
});
var socketLogFile = new _winston["default"].transports.DailyRotateFile({
  filename: './logs/socketio-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '3d'
});
var appLogger = exports.appLogger = _winston["default"].createLogger({
  level: process.env.LOG_LEVEL || 'verbose',
  format: format.combine(format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A'
  }), format.json()),
  transports: [new _winston["default"].transports.Console({
    format: format.combine(format.colorize(), format.timestamp(), format.label({
      label: "app",
      message: false
    }), format.printf(function (_ref) {
      var level = _ref.level,
        message = _ref.message,
        timestamp = _ref.timestamp,
        label = _ref.label;
      return "".concat(TIMESTAMP_COLOR(timestamp), " ").concat(LABEL_COLOR(label), " [").concat(level, "]: ").concat(message);
    }))
  }), appLogFile]
});
var httpLogger = exports.httpLogger = _winston["default"].createLogger({
  level: process.env.LOG_LEVEL || 'verbose',
  format: format.combine(format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A'
  }), format.json()),
  transports: [new _winston["default"].transports.Console({
    format: format.combine(format.colorize(), format.timestamp(), format.label({
      label: "http",
      message: false
    }), format.printf(function (_ref2) {
      var level = _ref2.level,
        message = _ref2.message,
        timestamp = _ref2.timestamp,
        label = _ref2.label,
        meta = _objectWithoutProperties(_ref2, _excluded);
      var log = "".concat(TIMESTAMP_COLOR(timestamp), " ").concat(LABEL_COLOR(label), " [").concat(level, "]: ");
      if (message === '<<' || message === '>>') {
        log = log.concat("".concat(_chalk["default"].red(message), " ").concat(meta.remote_addr, " - ").concat(meta.remote_user, " \"").concat(meta.method, " ") + "".concat(meta.url, " HTTP/").concat(meta.http_version, "\" ").concat(meta.status, " ").concat(meta.content_length, " "));
        if (message === '<<') {
          return log.concat("\"".concat(meta.referer, "\" \"").concat(meta.user_agent));
        } else if (message === '>>') {
          return log.concat("- ".concat(meta.response_time, " ms"));
        }
      } else {
        return log.concat("".concat(message));
      }
    }))
  }), httpLogFile]
});
var levels = {
  error: 0,
  warn: 1,
  info: 2,
  event: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
var socketioLogger = exports.socketioLogger = _winston["default"].createLogger({
  level: process.env.LOG_LEVEL || 'verbose',
  levels: levels,
  format: format.combine(format.timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A'
  }), format.json()),
  transports: [new _winston["default"].transports.Console({
    format: format.combine(format.colorize(), format.timestamp(), format.label({
      label: "socketio",
      message: false
    }), format.printf(function (_ref3) {
      var level = _ref3.level,
        message = _ref3.message,
        timestamp = _ref3.timestamp,
        label = _ref3.label,
        meta = _objectWithoutProperties(_ref3, _excluded2);
      var log = "".concat(TIMESTAMP_COLOR(timestamp), " ").concat(LABEL_COLOR(label), " [").concat(level, "]: ");
      if (message == '<<' || message === '>>') {
        return log.concat("Socket ID: ".concat(meta.id, " - ").concat(meta.remote_addr, " ").concat(_chalk["default"].red(message), " ").concat(meta.event || '', " - ").concat(JSON.stringify(meta.args)));
      } else if (message === 'Connected' || message === 'Disconnected') {
        log = log.concat("Socket ID: ".concat(meta.id, " - ").concat(meta.remote_addr, " "));
        if (message === 'Connected') {
          return log.concat("".concat(_chalk["default"].red(meta.status), " - \"").concat(meta.referer, "\" \"").concat(meta.user_agent, "\""));
        } else if (message === 'Disconnected') {
          return log.concat("".concat(_chalk["default"].red('Disconnected'), " - ").concat(meta.reason || ''));
        }
      } else {
        return log.concat("Socket ID: ".concat(meta.id, " - ").concat(meta.remote_addr, " ").concat(message));
      }
    }))
  }), socketLogFile]
});