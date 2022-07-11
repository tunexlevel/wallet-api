"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = __importDefault(require("./src/cron/index"));
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), 'SERVIC JOB RUNNING');
(0, index_1.default)();
