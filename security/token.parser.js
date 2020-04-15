"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var users_model_1 = require("../users/users.model");
var environment_1 = require("../common/environment");
exports.tokenParser = function (req, resp, next) {
    var token = extractToken(req);
    if (token) {
        jwt.verify(token, environment_1.environment.security.apiSecret, applyBearer(req, next));
    }
    else {
        next();
    }
};
function extractToken(req) {
    //Authorization: Bearer TOKEN
    var token = undefined;
    var authorization = req.header('authorization');
    if (authorization) {
        var parts = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1];
        }
    }
    return token;
}
function applyBearer(req, next) {
    return function (error, decoded) {
        if (decoded) {
            users_model_1.User.findByEmail(decoded.sub).then(function (user) {
                if (user) {
                    //associar o usuário no request
                    req.authenticated = user; //
                }
                next();
            }).catch(next);
        }
        else {
            next();
        }
    };
}
