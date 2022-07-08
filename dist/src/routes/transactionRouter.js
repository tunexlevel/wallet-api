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
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const transaction_1 = require("../schema/transaction");
const transactionController_1 = __importDefault(require("../controllers/transactionController"));
const transactionRouter = (0, express_1.Router)();
transactionRouter.post("/transfer", (0, express_validator_1.checkSchema)((0, transaction_1.Transfer)()), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const txn = new transactionController_1.default();
    const reply = yield txn.transfer(req.body);
    res.status(reply.status).send(reply);
}));
transactionRouter.get("/history/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        return res.status(400).json({ error: "The  id is required" });
    }
    const txn = new transactionController_1.default();
    const reply = yield txn.txnHistory(parseInt(req.params.id));
    return res.status(reply.status).json(reply);
}));
transactionRouter.get("/batch-transactions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const txn = new transactionController_1.default();
    const reply = yield txn.txnJobs();
    res.status(reply.status).send(reply);
}));
exports.default = transactionRouter;
