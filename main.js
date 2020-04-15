"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server/server");
var users_router_1 = require("./users/users.router");
var restaurants_router_1 = require("./restaurants/restaurants.router");
var reviews_router_1 = require("./reviews/reviews.router");
var main_router_1 = require("./main.router");
var server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    reviews_router_1.reviewsRouter,
    main_router_1.mainRouter
]).then(function (server) {
    console.log('Server is listening on:', server.application.address());
}).catch(function (error) {
    console.log('Server failed to start');
    console.error(error);
    process.exit(1);
});
