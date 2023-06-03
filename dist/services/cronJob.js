"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
function executeCronJob() {
    node_cron_1.default.schedule('* * * * *', () => {
        console.log('Cron job executed');
        // Your code to be executed goes here
    });
}
exports.executeCronJob = executeCronJob;
