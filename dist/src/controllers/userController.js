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
const user_1 = __importDefault(require("../models/user"));
const moment_1 = __importDefault(require("moment"));
const wallet_1 = __importDefault(require("../models/wallet"));
const index_1 = __importDefault(require("../models/index"));
const crypto_1 = require("crypto");
class userController {
    //setup new user with an active
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.first_name = data.first_name;
            this.last_name = data.last_name;
            this.email = data.email;
            this.password = data.password;
            const check = yield user_1.default.findOne({ attributes: ['id'], where: { email: this.email } });
            if (check === null || check === void 0 ? void 0 : check.id) {
                return { status: 400, message: "The user email already exist" };
            }
            const t = yield index_1.default.transaction();
            try {
                const salt = (0, crypto_1.randomBytes)(16).toString('hex');
                const hash = (0, crypto_1.pbkdf2Sync)(this.password, salt, 1000, 64, `sha512`).toString(`hex`);
                const user = yield user_1.default.create({
                    first_name: this.first_name,
                    last_name: this.last_name,
                    status: 'Active',
                    email: this.email,
                    password: hash,
                    salt: salt
                }, { transaction: t });
                const wallet = yield wallet_1.default.findOne({ order: [['id', 'DESC']], limit: 1 });
                const wallet_id = wallet ? wallet.wallet_id + 1 : 100000000;
                yield wallet_1.default.create({
                    user_id: user.id,
                    wallet_id: wallet_id,
                    balance: 100000
                }, { transaction: t });
                yield t.commit();
                return { status: 200, message: "The user was created successfully", wallet_id };
            }
            catch (e) {
                yield t.rollback();
                return { status: 400, message: "failed to create account", reason: e };
            }
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.email = data.email;
            this.password = data.password;
            const check = yield user_1.default.findOne({ attributes: ['id', 'salt', 'password'], where: { email: this.email } });
            if (!(check === null || check === void 0 ? void 0 : check.id)) {
                return { status: 400, message: "Invalid login credentails" };
            }
            if (!this.validatePassword(this.password, check.salt, check.password)) {
                return { status: 400, message: "Invalid login credentails" };
            }
            const salt = (0, crypto_1.randomBytes)(16).toString('hex');
            const password = (0, crypto_1.pbkdf2Sync)(this.password, salt, 1000, 64, `sha512`).toString(`hex`);
            const token = (0, crypto_1.pbkdf2Sync)(this.email, salt, 1000, 64, `sha512`).toString(`hex`);
            try {
                yield user_1.default.update({
                    password: password,
                    salt: salt,
                    token: token,
                    last_seen: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss')
                }, { where: { email: this.email } });
                return { status: 200, message: "The user was login successfully", token };
            }
            catch (e) {
                return { status: 400, message: "Failed to login account", reason: e };
            }
        });
    }
    getUserByWalletId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield wallet_1.default.findOne({ attributes: ['user_id'], where: [{ wallet_id: id }] });
                if (!(wallet === null || wallet === void 0 ? void 0 : wallet.user_id)) {
                    return { status: 400, message: "User is not found", wallet };
                }
                const user = yield user_1.default.findOne({ attributes: ['first_name', 'email', 'last_name', 'id'], where: [{ id: wallet.user_id }] });
                return { status: 200, name: (user === null || user === void 0 ? void 0 : user.first_name) + ' ' + (user === null || user === void 0 ? void 0 : user.last_name), user_id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email };
            }
            catch (e) {
                return { status: 400, message: "failed to get wallet id details", reason: e };
            }
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_1.default.findOne({ attributes: ['email', 'last_seen', 'id'], where: [{ token }] });
                if (!(user === null || user === void 0 ? void 0 : user.id) || user.last_seen === '') {
                    return { status: 400, message: "Invalid token!" };
                }
                const timeInterval = (0, moment_1.default)().diff(user.last_seen, 'minutes');
                if (timeInterval > 15) {
                    return { status: 400, message: "Inactive for a while, kindly login again!" };
                }
                user.update({ last_seen: (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss') });
                return { status: 200, message: "Active user!" };
            }
            catch (e) {
                return { status: 400, message: "Failed to fetch user" };
            }
        });
    }
    validatePassword(password, salt, originalPassword) {
        const hash = (0, crypto_1.pbkdf2Sync)(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash === originalPassword;
    }
}
exports.default = userController;
