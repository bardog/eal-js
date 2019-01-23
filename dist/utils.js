'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateToken = undefined;

var _base = require('base-64');

var _lodash = require('lodash.random');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var generateToken = exports.generateToken = function generateToken() {
    return (0, _base.encode)(new Date().toISOString() + (0, _lodash2.default)(0, 9999));
};

exports.default = {
    generateToken: generateToken
};