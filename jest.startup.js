"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jestCli = require("jest-cli");
var server_1 = require("./server/server");
var environment_1 = require("./common/environment");
var users_router_1 = require("./users/users.router");
var reviews_router_1 = require("./reviews/reviews.router");
var restaurants_router_1 = require("./restaurants/restaurants.router");
var users_model_1 = require("./users/users.model");
var reviews_model_1 = require("./reviews/reviews.model");
var restaurants_model_1 = require("./restaurants/restaurants.model");
var server;
var beforeAllTests = function () {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://eatstuff-api-test-db';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter,
        restaurants_router_1.restaurantsRouter
    ])
        .then(function () { return users_model_1.User.remove({}).exec(); })
        .then(function () {
        var admin = new users_model_1.User();
        admin.name = 'admin';
        admin.email = 'admin@email.com';
        admin.password = '1234567';
        admin.profiles = ['admin', 'user'];
        return admin.save();
    })
        .then(function () { return reviews_model_1.Review.remove({}).exec(); })
        .then(function () { return restaurants_model_1.Restaurant.remove({}).exec(); });
};
var afterAllTests = function () {
    return server.shutdown();
};
beforeAllTests()
    .then(function () { return jestCli.run(); })
    .then(function () { return afterAllTests(); })
    .catch(console.error);
