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
const transaction_1 = __importDefault(require("../models/transaction"));
const index_1 = __importDefault(require("../models/index"));
const userController_1 = __importDefault(require("./userController"));
const history_1 = __importDefault(require("../models/history"));
const sequelize_1 = require("sequelize");
const batch_1 = __importDefault(require("../models/batch"));
class transactionController extends userController_1.default {
    //setup new user with an active
    transfer(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.amount = data.amount;
            this.sender_wallet_id = data.sender_wallet_id;
            this.receiver_wallet_id = data.receiver_wallet_id;
            const t = yield index_1.default.transaction();
            try {
                //validate balance before fund transfer
                const check = yield this.validateFundTransfer();
                const session_id = (0, moment_1.default)().format('x').toString() + (check === null || check === void 0 ? void 0 : check.userId);
                this.transaction_date = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
                if (check.status !== 200 || !(check === null || check === void 0 ? void 0 : check.userId)
                    || !(check === null || check === void 0 ? void 0 : check.sBalance)
                    || !(check === null || check === void 0 ? void 0 : check.rBalance)
                    || !(check === null || check === void 0 ? void 0 : check.rName)
                    || !(check === null || check === void 0 ? void 0 : check.sName)) {
                    if ((check === null || check === void 0 ? void 0 : check.sName) && (check === null || check === void 0 ? void 0 : check.sBalance) && (check === null || check === void 0 ? void 0 : check.userId)) {
                        this.failedTxn(check.sName, check.sBalance, session_id, check.userId);
                    }
                    return check;
                }
                //save transaction
                yield transaction_1.default.create({
                    amount: this.amount,
                    session_id: session_id,
                    credit_wallet_id: this.receiver_wallet_id,
                    debit_wallet_id: this.sender_wallet_id,
                    user_id: check.userId,
                    status: "Successful",
                    transaction_date: this.transaction_date,
                    created_at: new Date()
                }, { transaction: t });
                //decrease sender balance
                yield wallet_1.default.decrement({ balance: this.amount }, { where: { wallet_id: this.sender_wallet_id }, transaction: t });
                //increase receiver balance
                yield wallet_1.default.increment({ balance: this.amount }, { where: { wallet_id: this.receiver_wallet_id }, transaction: t });
                //create a transaction history for the sender
                yield history_1.default.create({
                    session_id: session_id,
                    user_id: this.sender_wallet_id,
                    recipient_id: this.receiver_wallet_id,
                    recipient_name: check.rName,
                    status: "Successful",
                    type: 'Debit',
                    credit_wallet_id: this.receiver_wallet_id,
                    debit_wallet_id: this.sender_wallet_id,
                    amount: this.amount,
                    transaction_date: this.transaction_date,
                    pre_balance: check.sBalance,
                    post_balance: check.sBalance - this.amount
                }, { transaction: t });
                //create a transaction history for the receiver
                yield history_1.default.create({
                    session_id: session_id,
                    user_id: this.receiver_wallet_id,
                    type: 'Credit',
                    recipient_id: this.sender_wallet_id,
                    recipient_name: check.sName,
                    status: "Successful",
                    credit_wallet_id: this.receiver_wallet_id,
                    debit_wallet_id: this.sender_wallet_id,
                    amount: this.amount,
                    transaction_date: this.transaction_date,
                    pre_balance: check.rBalance,
                    post_balance: check.rBalance + this.amount
                }, { transaction: t });
                const summary = {
                    session_id,
                    transaction_date: this.transaction_date,
                    sender: check.sName,
                    receiver: check.rName,
                    amount: this.amount
                };
                yield t.commit();
                return { status: 200, message: "Transfer Successful!", summary };
            }
            catch (e) {
                yield t.rollback();
                return { status: 400, message: "Failed to transfer", reason: e };
            }
        });
    }
    getUserByWalletId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const wallet = yield wallet_1.default.findOne({ attributes: ['user_id', 'balance'], where: [{ wallet_id: id }] });
                if (!(wallet === null || wallet === void 0 ? void 0 : wallet.user_id)) {
                    return { status: 400, message: "User is not found", wallet };
                }
                const user = yield user_1.default.findOne({ attributes: ['first_name', 'email', 'last_name', 'id'], where: [{ id: wallet.user_id }] });
                return { status: 200, name: (user === null || user === void 0 ? void 0 : user.first_name) + ' ' + (user === null || user === void 0 ? void 0 : user.last_name), balance: wallet.balance, user_id: user === null || user === void 0 ? void 0 : user.id, email: user === null || user === void 0 ? void 0 : user.email };
            }
            catch (e) {
                return { status: 400, message: "failed to get wallet id details", reason: e };
            }
        });
    }
    validateFundTransfer() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sendUser = yield this.getUserByWalletId(this.sender_wallet_id);
                if (!(sendUser === null || sendUser === void 0 ? void 0 : sendUser.user_id)) {
                    return { status: 400, message: "Sender Id is not found" };
                }
                else if (this.amount === 0) {
                    return { status: 400, message: "You can't send zero amount" };
                }
                else if ((sendUser.balance - this.amount) < 0) {
                    return { status: 400, message: "Insuffucient fund", userId: sendUser.user_id, sName: sendUser.name, sBalance: sendUser.balance };
                }
                const receiveUser = yield this.getUserByWalletId(this.receiver_wallet_id);
                if (!(receiveUser === null || receiveUser === void 0 ? void 0 : receiveUser.user_id)) {
                    return { status: 400, message: "Receiver Id is not found" };
                }
                return { status: 200, message: "ok", userId: sendUser.user_id, sName: sendUser.name, rName: receiveUser.name, sBalance: sendUser.balance, rBalance: receiveUser.balance };
            }
            catch (e) {
                return { status: 400, message: "failed to validate user", reason: e };
            }
        });
    }
    txnHistory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield wallet_1.default.findOne({ where: { [sequelize_1.Op.or]: [{ wallet_id: id }, { user_id: id }] } });
                if (!(user === null || user === void 0 ? void 0 : user.user_id)) {
                    return { status: 400, message: "User id not found" };
                }
                const txnHistory = yield history_1.default.findAll({ attributes: ['amount', 'type', 'transaction_date', 'user_id', 'recipient_id', 'recipient_name', 'status'], where: { user_id: id }, order: [['id', 'DESC']] });
                return { status: 200, history: txnHistory };
            }
            catch (e) {
                return { status: 200, message: "Failed to get history", reason: e };
            }
        });
    }
    txnJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            const txns = yield batch_1.default.findAll({
                attributes: ['id', 'user_id', 'type', 'flag', 'session_id',
                    'credit_wallet_id', 'debit_wallet_id',
                    'amount', 'transaction_date', 'status', 'created_at']
            });
            if (txns.length < 1) {
                return { status: 200, message: "No jobs found yet" };
            }
            return { status: 200, lists: txns };
        });
    }
    failedTxn(name, balance, session_id, user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield transaction_1.default.create({
                    amount: this.amount,
                    session_id: session_id,
                    credit_wallet_id: this.receiver_wallet_id,
                    debit_wallet_id: this.sender_wallet_id,
                    user_id: user_id,
                    status: "Failed",
                    transaction_date: this.transaction_date,
                    created_at: new Date()
                });
                yield history_1.default.create({
                    session_id: session_id,
                    user_id: this.sender_wallet_id,
                    recipient_id: this.receiver_wallet_id,
                    recipient_name: name,
                    status: "Failed",
                    type: 'Debit',
                    credit_wallet_id: this.receiver_wallet_id,
                    debit_wallet_id: this.sender_wallet_id,
                    amount: this.amount,
                    transaction_date: this.transaction_date,
                    pre_balance: balance,
                    post_balance: balance
                });
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
exports.default = transactionController;
