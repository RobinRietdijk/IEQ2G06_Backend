"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = _interopRequireDefault(require("express"));
var _constants = require("../utils/constants");
var _logger = require("../utils/logger");
var _handler = _interopRequireDefault(require("./handler"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var router = _express["default"].Router();
var errorHandler = function errorHandler(error, req, res, next) {
  _logger.appLogger.error(error.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: error.message
  });
};
router.route(_constants.ROUTES.INDEX).get(_handler["default"].GET);
router.use(errorHandler);
var _default = exports["default"] = router;