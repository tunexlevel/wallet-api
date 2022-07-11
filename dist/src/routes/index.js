"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionRouter_1 = __importDefault(require("./transactionRouter"));
const userRouter_1 = __importDefault(require("./userRouter"));
const tokenRouter_1 = require("./tokenRouter");
const router = (0, express_1.Router)();
router.use(tokenRouter_1.tokenRouter);
router.use('/user', userRouter_1.default);
router.use(transactionRouter_1.default);
exports.default = router;
