"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_errors_1 = require("restify-errors");
exports.authorize = function () {
    var profiles = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        profiles[_i] = arguments[_i];
    }
    return function (req, resp, next) {
        if (req.authenticated !== undefined && (_a = req.authenticated).hasAny.apply(_a, profiles)) {
            next();
        }
        else {
            next(new restify_errors_1.ForbiddenError('Permission denied'));
        }
        var _a;
    };
};
