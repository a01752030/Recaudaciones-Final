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
const AbstractController_1 = __importDefault(require("./AbstractController"));
const recaudacionModel_1 = require("../models/recaudacionModel");
class FunController extends AbstractController_1.default {
    constructor() {
        super(...arguments);
        this._model = recaudacionModel_1.FunModel;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new FunController('fun');
        }
        return this.instance;
    }
    initializeRoutes() {
        this.router.get("/totalDonaciones/:fundacion", this.DonTotal.bind(this));
        this.router.post("/donacion", this.donacion.bind(this));
        this.router.post("/configuracion", this.conf.bind(this));
        this.router.get("/todo", this.Todo.bind(this));
        this.router.post("/create", this.createNewDocument.bind(this));
    }
    createNewDocument(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { _id, fundacion, proposito, meta, saldo } = req.body;
                const savedFund = yield recaudacionModel_1.FunModel.create({
                    _id,
                    fundacion,
                    proposito,
                    meta,
                    saldo
                });
                res.status(201).json({ message: "New document created successfully", fund: savedFund });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    Todo(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const funds = yield recaudacionModel_1.FunModel.find();
                res.status(200).json({ funds });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    DonTotal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fundacion = req.params.fundacion;
                const fund = yield recaudacionModel_1.FunModel.findOne({ fundacion });
                if (!fund) {
                    res.status(404).json({ error: "Fundacion not found" });
                }
                else {
                    const donacion = fund === null || fund === void 0 ? void 0 : fund.saldo;
                    res.status(200).json({ donacion });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    donacion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fundacion, donacion } = req.body;
                const updatedFund = yield recaudacionModel_1.FunModel.findOneAndUpdate({ fundacion: fundacion }, { $inc: { saldo: donacion } }, { new: true });
                if (!updatedFund) {
                    res.status(404).json({ error: "Fundacion not found" });
                    return;
                }
                res.status(200).json({ message: "Donation added successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    conf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fundacion, proposito, meta } = req.body;
                const updatedFund = yield recaudacionModel_1.FunModel.findOneAndUpdate({ fundacion }, { proposito, meta }, { new: true });
                if (!updatedFund) {
                    res.status(404).json({ error: "Fundacion not found" });
                    return;
                }
                res.status(200).json({ message: "Configuration updated successfully" });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
}
exports.default = FunController;
function next() {
    throw new Error("Function not implemented.");
}
