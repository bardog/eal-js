'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _asyncStorage = require('@callstack/async-storage');

var _asyncStorage2 = _interopRequireDefault(_asyncStorage);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash.get');

var _lodash2 = _interopRequireDefault(_lodash);

var _config = require('./config');

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EAL = function () {
    function EAL(_ref) {
        var _this = this;

        var user = _ref.user,
            password = _ref.password,
            ealUrl = _ref.ealUrl;

        _classCallCheck(this, EAL);

        if (!user || !password) {
            throw 'The credentials provided are not valid. Please provide user and password to connect.';
        }

        this.user = user;
        this.password = password;
        this.baseUrl = ealUrl || _config.baseUrl;
        this.sessionToken = '';

        return _asyncStorage2.default.getItem('eal_token').then(function (sessionToken) {
            if (sessionToken) _this.sessionToken = sessionToken;else _this.resetSessionToken();

            return _this;
        });
    }

    _createClass(EAL, [{
        key: 'resetSessionToken',
        value: function resetSessionToken() {
            this.sessionToken = (0, _utils.generateToken)();
            _asyncStorage2.default.setItem('eal_token', this.sessionToken);
        }
    }, {
        key: 'checkParams',
        value: function checkParams(params, uniqueAction) {
            var user = params.user,
                business = params.business,
                action = params.action,
                actions = params.actions;

            var requiredPaths = [].concat(_toConsumableArray(user ? ['user.id', 'user.username', 'user.email'] : []), _toConsumableArray(business ? ['business.id', 'business.name'] : []), _toConsumableArray(uniqueAction ? ['action', 'action.datetime', 'action.name'] : []), _toConsumableArray(action && action.object ? ['action.object.id', 'action.object.className'] : []));
            var validParams = true;
            var validActions = true;
            var errors = [];

            requiredPaths.forEach(function (path) {
                var validParam = !!(0, _lodash2.default)(params, path, false);

                if (!validParam) {
                    validParams = false;
                    errors.push('Param with path "' + path + '" is required.');
                }
            });

            if (!uniqueAction) {
                //Validate actions array if exists
                actions.forEach(function (action) {
                    if (!action.datetime) {
                        validActions = false;
                        errors.push('Check your actions, some of them are losing "datetime" field.');
                    }

                    if (!action.name) {
                        validActions = false;
                        errors.push('Check your actions, some of them are losing "name" field.');
                    }
                });
            }

            if (!validParams || !validActions) {
                throw errors.join('\n');
            }
        }
    }, {
        key: 'addEvents',
        value: function addEvents(params) {
            var uniqueAction = false;

            this.checkParams(params, uniqueAction);
            return this.addEventGeneric(params, uniqueAction);
        }
    }, {
        key: 'addEvent',
        value: function addEvent(params) {
            var uniqueAction = true;

            this.checkParams(params, uniqueAction);
            return this.addEventGeneric(params, uniqueAction);
        }
    }, {
        key: 'addEventGeneric',
        value: function addEventGeneric(params, uniqueAction) {
            var _params$user = params.user,
                user = _params$user === undefined ? {} : _params$user,
                _params$business = params.business,
                business = _params$business === undefined ? {} : _params$business,
                _params$action = params.action,
                action = _params$action === undefined ? {} : _params$action,
                _params$actions = params.actions,
                actions = _params$actions === undefined ? [] : _params$actions;

            var userId = user.id,
                userName = user.username,
                userEmail = user.email,
                userFirstName = user.firstName,
                userLastName = user.lastName,
                userPhone = user.phone,
                userExtraFields = _objectWithoutProperties(user, ['id', 'username', 'email', 'firstName', 'lastName', 'phone']);

            var businessId = business.id,
                businessName = business.name,
                businessEmail = business.email,
                businessPhone = business.phone,
                businessWebsite = business.website,
                businessExtraFields = _objectWithoutProperties(business, ['id', 'name', 'email', 'phone', 'website']);

            var actionName = action.name,
                actionDatetime = action.datetime,
                actionCategory = action.category,
                _action$object = action.object,
                object = _action$object === undefined ? {} : _action$object,
                actionExtraFields = _objectWithoutProperties(action, ['name', 'datetime', 'category', 'object']);

            var objectId = object.id,
                objectBefore = object.before,
                objectAfter = object.after,
                objectClassName = object.className;


            return (0, _axios2.default)({
                url: uniqueAction ? _config.endpoints.addEvent : _config.endpoints.addEvents,
                method: 'POST',
                baseURL: this.baseUrl,
                data: _extends({
                    user: Object.keys(user).length ? {
                        id: userId,
                        username: userName,
                        email: userEmail,
                        first_name: userFirstName,
                        last_name: userLastName,
                        phone: userPhone,
                        extra_fields: userExtraFields
                    } : undefined,
                    business: Object.keys(business).length ? {
                        id: businessId,
                        name: businessName,
                        email: businessEmail,
                        phone: businessPhone,
                        website: businessWebsite,
                        extra_fields: businessExtraFields
                    } : undefined,
                    session_token: this.sessionToken
                }, uniqueAction ? {
                    action: {
                        name: actionName,
                        datetime: actionDatetime,
                        category: actionCategory,
                        extra_fields: actionExtraFields,
                        object: Object.keys(object).length ? {
                            id: objectId,
                            before: objectBefore,
                            after: objectAfter,
                            class_name: objectClassName
                        } : undefined
                    }
                } : {
                    actions: actions.map(function (action) {
                        return _extends({
                            name: action.name,
                            datetime: action.datetime,
                            category: action.category,
                            extra_fields: action.extraFields
                        }, action.object ? {
                            object: {
                                id: object.id,
                                class_name: object.className,
                                before: object.before,
                                after: object.after
                            }
                        } : {});
                    })
                }),
                auth: {
                    username: this.user,
                    password: this.password
                }
            });
        }
    }]);

    return EAL;
}();

exports.default = EAL;