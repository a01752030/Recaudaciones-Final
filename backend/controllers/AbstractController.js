"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var AbstractController = /** @class */ (function () {
    // Constructor
    function AbstractController(prefix) {
        this._router = (0, express_1.Router)();
        this._prefix = prefix;
        this.initializeRoutes();
    }
    Object.defineProperty(AbstractController.prototype, "router", {
        get: function () {
            return this._router;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AbstractController.prototype, "prefix", {
        get: function () {
            return this._prefix;
        },
        enumerable: false,
        configurable: true
    });
    return AbstractController;
}());
exports.default = AbstractController;
