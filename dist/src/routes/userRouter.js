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
const userController_1 = __importDefault(require("../controllers/userController"));
const express_validator_1 = require("express-validator");
const user_1 = require("../schema/user");
const userRouter = (0, express_1.Router)();
userRouter.post("/login", (0, express_validator_1.checkSchema)((0, user_1.login)()), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new userController_1.default();
    const reply = yield user.login(req.body);
    res.status(reply.status).send(reply);
}));
userRouter.post("/new", (0, express_validator_1.checkSchema)((0, user_1.createAccount)()), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const user = new userController_1.default();
    const reply = yield user.createUser(req.body);
    res.status(reply.status).send(reply);
}));
userRouter.get("/:wallet_id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.wallet_id) {
        return res.status(400).json({ error: "The wallet id is required" });
    }
    if (isNaN(parseInt(req.params.wallet_id))) {
        return res.status(400).json({ status: 400, message: "Invalid wallet id. It must be numeric" });
    }
    const user = new userController_1.default();
    const reply = yield user.getUserByWalletId(parseInt(req.params.wallet_id));
    return res.status(reply.status).json(reply);
}));
exports.default = userRouter;
