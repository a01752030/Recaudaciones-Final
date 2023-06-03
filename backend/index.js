"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./providers/server");
var userController_1 = require("./controllers/userController");
//import recaudacionController from "./controllers/recaudacionController"
var server = new server_1.default({
    port: 8080,
    controllers: [
        userController_1.default.getInstance()
    ],
    mongoUrl: "mongodb://localhost:27017",
});
server.connect();
server.init();
