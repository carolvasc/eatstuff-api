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
var router_1 = require("./router");
var mongoose = require("mongoose");
var restify_errors_1 = require("restify-errors");
var ModelRouter = /** @class */ (function (_super) {
    __extends(ModelRouter, _super);
    function ModelRouter(model) {
        var _this = _super.call(this) || this;
        _this.model = model;
        _this.pageSize = 2;
        _this.validateId = function (req, resp, next) {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                next(new restify_errors_1.NotFoundError('Document not found'));
            }
            else {
                next();
            }
        };
        _this.findAll = function (req, resp, next) {
            var page = parseInt(req.query._page || 1);
            page = page > 0 ? page : 1;
            var skip = (page - 1) * _this.pageSize;
            _this.model
                .count({}).exec()
                .then(function (count) { return _this.model.find()
                .skip(skip)
                .limit(_this.pageSize)
                .then(_this.renderAll(resp, next, {
                page: page, count: count, pageSize: _this.pageSize, url: req.url
            })); })
                .catch(next);
        };
        _this.findById = function (req, resp, next) {
            _this.prepareOne(_this.model.findById(req.params.id))
                .then(_this.render(resp, next))
                .catch(next);
        };
        _this.save = function (req, resp, next) {
            var document = new _this.model(req.body);
            document.save()
                .then(_this.render(resp, next))
                .catch(next);
        };
        _this.replace = function (req, resp, next) {
            var options = { runValidators: true, overwrite: true };
            _this.model.update({ _id: req.params.id }, req.body, options)
                .exec().then(function (result) {
                if (result.n) {
                    return _this.prepareOne(_this.model.findById(req.params.id));
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
            }).then(_this.render(resp, next))
                .catch(next);
        };
        _this.update = function (req, resp, next) {
            var options = { runValidators: true, new: true };
            _this.model.findByIdAndUpdate(req.params.id, req.body, options)
                .then(_this.render(resp, next))
                .catch(next);
        };
        _this.delete = function (req, resp, next) {
            _this.model.remove({ _id: req.params.id }).exec().then(function (cmdResult) {
                if (cmdResult.result.n) {
                    resp.send(204);
                }
                else {
                    throw new restify_errors_1.NotFoundError('Documento não encontrado');
                }
                return next();
            }).catch(next);
        };
        _this.basePath = "/" + model.collection.name;
        return _this;
    }
    ModelRouter.prototype.prepareOne = function (query) {
        return query;
    };
    ModelRouter.prototype.envelope = function (document) {
        var resource = Object.assign({ _links: {} }, document.toJSON());
        resource._links.self = this.basePath + "/" + resource._id;
        return resource;
    };
    ModelRouter.prototype.envelopeAll = function (documents, options) {
        if (options === void 0) { options = {}; }
        var resource = {
            _links: {
                self: "" + options.url
            },
            items: documents
        };
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = this.basePath + "?_page=" + (options.page - 1);
            }
            var remaining = options.count - (options.page * options.pageSize);
            if (remaining > 0) {
                resource._links.next = this.basePath + "?_page=" + (options.page + 1);
            }
        }
        return resource;
    };
    return ModelRouter;
}(router_1.Router));
exports.ModelRouter = ModelRouter;
