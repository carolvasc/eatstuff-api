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
var router_1 = require("./common/router");
var MainRouter = /** @class */ (function (_super) {
    __extends(MainRouter, _super);
    function MainRouter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MainRouter.prototype.applyRoutes = function (application) {
        application.get('/', function (req, resp, next) {
            resp.json({
                users: '/users',
                restaurants: '/restaurants',
                reviews: '/reviews'
            });
        });
    };
    return MainRouter;
}(router_1.Router));
exports.mainRouter = new MainRouter();
