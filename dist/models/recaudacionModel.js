"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunModel = exports.Fun = void 0;
const mongoose_1 = require("mongoose");
//Esquema
const FunSchema = new mongoose_1.Schema({
    _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    fundacion: { type: String, required: true },
    proposito: { type: String, required: true },
    meta: { type: Number, required: true },
    saldo: { type: Number, required: true }
});
exports.Fun = FunSchema;
exports.FunModel = (0, mongoose_1.model)('Fun', FunSchema);
