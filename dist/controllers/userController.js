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
const mongoose_1 = require("mongoose");
const AbstractController_1 = __importDefault(require("./AbstractController"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
aws_sdk_1.default.config.update({ region: "us-east-1" });
const userModel_1 = require("../models/userModel");
class userController extends AbstractController_1.default {
    static getInstance() {
        if (!this.instance) {
            this.instance = new userController();
        }
        return this.instance;
    }
    constructor() {
        super('user');
        this._model = userModel_1.UserModel;
        this.cognito = new aws_sdk_1.default.CognitoIdentityServiceProvider();
    }
    initializeRoutes() {
        this.router.post("/signup", this.createUser.bind(this));
        this.router.post("/signin", this.signIn.bind(this));
        this.router.post("/verify", this.verifyUser.bind(this));
        this.router.post("/verification-token", this.getVerificationToken.bind(this));
        //this.router.post("/test",this.test.bind(this));
    }
    createUser(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { nombre, fundacion, email, password } = req.body;
                const userPoolId = "us-east-1_ARVF3iMJB";
                const params = {
                    UserPoolId: userPoolId,
                    Username: email,
                    TemporaryPassword: password,
                    UserAttributes: [
                        {
                            Name: "email",
                            Value: email,
                        },
                    ],
                };
                const cognitoUser = yield this.cognito.adminCreateUser(params).promise();
                if (!cognitoUser.User) {
                    throw new Error("Cognito user not found");
                }
                const newUser = {
                    _id: new mongoose_1.Types.ObjectId(),
                    nombre,
                    fundacion,
                    email: ((_a = cognitoUser.User) === null || _a === void 0 ? void 0 : _a.Username) || "",
                };
                const createdUser = yield userModel_1.UserModel.create(newUser);
                res.status(200).json({ message: "User created successfully", user: createdUser });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    verifyUser(req, res) {
        const { email, verificationCode } = req.body;
        const params = {
            ClientId: "blkf8b3qj5deim2snvar8q2ma",
            Username: email,
            ConfirmationCode: verificationCode,
        };
        this.cognito.confirmSignUp(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            }
            else {
                res.status(200).json({ message: "User verification successful" });
            }
        });
    }
    signIn(req, res) {
        const { email, password } = req.body;
        const params = {
            AuthFlow: "ADMIN_USER_PASSWORD_AUTH",
            ClientId: "blkf8b3qj5deim2snvar8q2ma",
            UserPoolId: "us-east-1_ARVF3iMJB",
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };
        this.cognito.adminInitiateAuth(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            }
            else {
                res.status(200).json({ message: "Sign in succesfull" });
            }
        });
    }
    getVerificationToken(req, res) {
        const { email } = req.body;
        const params = {
            UserPoolId: "us-east-1_ARVF3iMJB",
            Username: email,
        };
        this.cognito.adminGetUser(params, (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).json({ error: "Internal server error" });
            }
            else {
                const userAttributes = data.UserAttributes || [];
                const verificationAttribute = userAttributes.find((attribute) => attribute.Name === "email_verified");
                if (!verificationAttribute) {
                    res.status(404).json({ error: "Email not found" });
                }
                else if (verificationAttribute.Value !== "true") {
                    res.status(400).json({ error: "Email not verified" });
                }
                else {
                    const tokenAttribute = userAttributes.find((attribute) => attribute.Name === "email_verified_token");
                    if (!tokenAttribute) {
                        res.status(404).json({ error: "Verification token not found" });
                    }
                    else {
                        const verificationToken = tokenAttribute.Value;
                        res.status(200).json({ verificationToken });
                    }
                }
            }
        });
    }
}
exports.default = userController;
function next() {
    throw new Error("Function not implemented.");
}
