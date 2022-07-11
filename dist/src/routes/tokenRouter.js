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
exports.tokenRouter = void 0;
const userController_1 = __importDefault(require("../controllers/userController"));
const tokenRouter = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.originalUrl === "/v1/user/login" || req.originalUrl === "/v1/user/new") {
        next();
    }
    else if (req.headers.token && typeof req.headers.token === 'string') {
        const user = new userController_1.default();
        try {
            const check = yield user.validateToken(req.headers.token);
            if ((check === null || check === void 0 ? void 0 : check.status) == 200) {
                next();
            }
            else {
                return res.status(400).send({ status: 400, message: "Invalid token", reason: check === null || check === void 0 ? void 0 : check.message });
            }
        }
        catch (e) {
            return res.status(200).send({ message: "Token validation failed", reason: e });
        }
    }
    else {
        return res.status(400).send({ message: "No token specified", status: 400 });
    }
});
exports.tokenRouter = tokenRouter;
