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
var restify_errors_1 = require("restify-errors");
var restaurants_model_1 = require("./restaurants.model");
var authz_handler_1 = require("../security/authz.handler");
var RestaurantsRouter = /** @class */ (function (_super) {
    __extends(RestaurantsRouter, _super);
    function RestaurantsRouter() {
        var _this = _super.call(this, restaurants_model_1.Restaurant) || this;
        _this.findMenu = function (req, resp, next) {
            restaurants_model_1.Restaurant.findById(req.params.id, "+menu")
                .then(function (rest) {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    resp.json(rest.menu);
                    return next();
                }
            }).catch(next);
        };
        _this.replaceMenu = function (req, resp, next) {
            restaurants_model_1.Restaurant.findById(req.params.id).then(function (rest) {
                if (!rest) {
                    throw new restify_errors_1.NotFoundError('Restaurant not found');
                }
                else {
                    rest.menu = req.body; //ARRAY de MenuItem
                    return rest.save();
                }
            }).then(function (rest) {
                resp.json(rest.menu);
                return next();
            }).catch(next);
        };
        return _this;
    }
    RestaurantsRouter.prototype.envelope = function (document) {
        var resource = _super.prototype.envelope.call(this, document);
        resource._links.menu = this.basePath + "/" + resource._id + "/menu";
        return resource;
    };
    RestaurantsRouter.prototype.applyRoutes = function (application) {
        application.get("" + this.basePath, this.findAll);
        application.get(this.basePath + "/:id", [this.validateId, this.findById]);
        application.post("" + this.basePath, [authz_handler_1.authorize('admin'), this.save]);
        application.put(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.replace]);
        application.patch(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.update]);
        application.del(this.basePath + "/:id", [authz_handler_1.authorize('admin'), this.validateId, this.delete]);
        application.get(this.basePath + "/:id/menu", [this.validateId, this.findMenu]);
        application.put(this.basePath + "/:id/menu", [authz_handler_1.authorize('admin'), this.validateId, this.replaceMenu]);
    };
    return RestaurantsRouter;
}(model_router_1.ModelRouter));
exports.restaurantsRouter = new RestaurantsRouter();
