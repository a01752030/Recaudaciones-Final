"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
class Server {
    constructor(appInit) {
        this._app = (0, express_1.default)();
        this._app.use(express_1.default.json());
        this.port = appInit.port;
        this.mongoUrl = appInit.mongoUrl;
        this.loadControllers(appInit.controllers);
    }
    loadControllers(controllers) {
        controllers.forEach((controller) => {
            this._app.use(`/${controller.prefix}`, controller.router);
        });
    }
    init() {
        // Log details of the requests
        this._app.use((req, res, next) => {
            const startTime = Date.now();
            res.on("finish", () => {
                const duration = Date.now() - startTime;
                console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
            });
            next();
        });
        this.server = this._app.listen(this.port, () => {
            console.log(`Server Running @'http://localhost:${this.port}'`);
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.server) {
                yield new Promise((resolve, reject) => {
                    var _a;
                    (_a = this.server) === null || _a === void 0 ? void 0 : _a.close((err) => {
                        if (err) {
                            return reject(err);
                        }
                        resolve(true);
                    });
                });
            }
        });
    }
    connect() {
        mongoose_1.default
            .connect(this.mongoUrl, {})
            .then(() => {
            console.log("Successfully connected to MongoDB");
        })
            .catch((e) => {
            console.log(e);
        });
    }
    disconnect() {
        mongoose_1.default.disconnect().then(() => { });
    }
    get app() {
        return this._app;
    }
}
exports.default = Server;
