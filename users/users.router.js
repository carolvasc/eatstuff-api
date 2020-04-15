"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var model_router_1 = require("../common/model-router");
var users_model_1 = require("./users.model");
var auth_handler_1 = require("../security/auth.handler");
var authz_handler_1 = require("../security/authz.handler");
var UsersRouter = /** @class */ (function (_super) {
    __extends(UsersRouter, _super);
    function UsersRouter() {
        var _this = _super.call(this, users_model_1.User) || this;
        _this.findByEmail = function (req, resp, next) {
            if (req.query.email) {
                users_model_1.User.findByEmail(req.query.email)
                    .then(function (user) { return user ? [user] : []; })
                    .then(_this.renderAll(resp, next, {
                    pageSize: _this.pageSize,
                    url: req.url
                }))
                    .catch(next);
            }
            else {
                next();
            }
        };
        _this.on('beforeRender', function (document) {
            document.password = undefined;
            //delete document.password
        });
        return _this;
    }
    UsersRouter.prototype.applyRoutes = function (application) {
        application.get({ path: "" + this.basePath, version: '2.0.0' }, [
            authz_handler_1.authorize('admin'),
            this.findByEmail,
            this.findAll
        ]);
        application.get({ path: "" + this.basePath, version: '1.0.0' }, [authz_handler_1.authorize('admin'), this.findAll]);
        application.get(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.findById]);
        application.post("" + this.basePath, [authz_handler_1.authorize('admin'), this.save]);
        application.put(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.post(this.basePath + "/authenticate", auth_handler_1.authenticate);
    };
    return UsersRouter;
}(model_router_1.ModelRouter));
exports.usersRouter = new UsersRouter();
