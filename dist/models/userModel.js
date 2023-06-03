"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
const mongoose_1 = require("mongoose");
//Esquema
const userSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    nombre: { type: String, required: true },
    fundacion: { type: String, required: true }
});
exports.User = userSchema;
exports.UserModel = (0, mongoose_1.model)('User', userSchema);
