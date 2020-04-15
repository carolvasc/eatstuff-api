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
var reviews_model_1 = require("./reviews.model");
var authz_handler_1 = require("../security/authz.handler");
var ReviewsRouter = /** @class */ (function (_super) {
    __extends(ReviewsRouter, _super);
    function ReviewsRouter() {
        return _super.call(this, reviews_model_1.Review) || this;
    }
    ReviewsRouter.prototype.prepareOne = function (query) {
        return query.populate('user', 'name')
            .populate('restaurant', 'name');
    };
    ReviewsRouter.prototype.envelope = function (document) {
        var resource = _super.prototype.envelope.call(this, document);
        var restId = document.restaurant._id ? document.restaurant._id : document.restaurant;
        resource._links.restaurant = "/restaurants/" + restId;
        return resource;
    };
    /*findById = (req, resp, next)=>{
      this.model.findById(req.params.id)
          .populate('user', 'name')
          .populate('restaurant', 'name')
          .then(this.render(resp, next))
          .catch(next)
    }*/
    ReviewsRouter.prototype.applyRoutes = function (application) {
        application.get("" + this.basePath, this.findAll);
        application.get(this.basePath + "/:id", [this.validateId, this.findById]);
        application.post("" + this.basePath, [authz_handler_1.authorize('user'), this.save]);
    };
    return ReviewsRouter;
}(model_router_1.ModelRouter));
exports.reviewsRouter = new ReviewsRouter();
