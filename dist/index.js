"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./providers/server"));
const userController_1 = __importDefault(require("./controllers/userController"));
const recaudacionController_1 = __importDefault(require("./controllers/recaudacionController"));
const server = new server_1.default({
    port: 8080,
    controllers: [
        userController_1.default.getInstance(),
        recaudacionController_1.default.getInstance()
    ],
    mongoUrl: "mongodb://127.0.0.1:27017/Recaudaciones",
});
server.connect();
server.init();
