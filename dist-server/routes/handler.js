"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var indexHandler = {
  GET: function GET(req, res) {
    res.render('index', {
      title: 'Express'
    });
  }
};
var _default = exports["default"] = indexHandler;