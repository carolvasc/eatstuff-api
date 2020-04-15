"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jwt = require("jsonwebtoken");
var restify_errors_1 = require("restify-errors");
var users_model_1 = require("../users/users.model");
var environment_1 = require("../common/environment");
exports.authenticate = function (req, resp, next) {
    var _a = req.body, email = _a.email, password = _a.password;
    users_model_1.User.findByEmail(email, '+password') //1st
        .then(function (user) {
        if (user && user.matches(password)) {
            //gerar o token
            //3rd
            var token = jwt.sign({ sub: user.email, iss: 'eatstuff-api' }, environment_1.environment.security.apiSecret);
            resp.json({ name: user.name, email: user.email, accessToken: token });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid Credentials'));
        }
    }).catch(next);
};
