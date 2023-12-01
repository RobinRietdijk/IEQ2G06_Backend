"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _path = require("path");
var _cookieParser = _interopRequireDefault(require("cookie-parser"));
var _morgan = require("./middleware/morgan");
var _index = _interopRequireDefault(require("./routes/index"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _cookieParser["default"])());
app.use(_express["default"]["static"]((0, _path.join)(__dirname, '../public')));
app.use("/socket-io", _express["default"]["static"]((0, _path.join)(__dirname, '../socket-admin')));
app.use(_morgan.requestLogger);
app.use('/', _index["default"]);
app.use(_morgan.responseLogger);
var _default = exports["default"] = app;