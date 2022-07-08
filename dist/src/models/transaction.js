"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class Transaction extends sequelize_1.Model {
    constructor() {
        super(...arguments);
        this.type = 'Transfer';
    }
}
Transaction.init({
    session_id: {
        type: sequelize_1.DataTypes.STRING
    },
    user_id: {
        type: sequelize_1.DataTypes.NUMBER
    },
    type: {
        type: sequelize_1.DataTypes.STRING
    },
    credit_wallet_id: {
        type: sequelize_1.DataTypes.NUMBER
    },
    debit_wallet_id: {
        type: sequelize_1.DataTypes.NUMBER
    },
    amount: {
        type: sequelize_1.DataTypes.NUMBER
    },
    transaction_date: {
        type: sequelize_1.DataTypes.STRING
    },
    status: {
        type: sequelize_1.DataTypes.STRING(30)
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE
    },
}, {
    timestamps: true,
    sequelize: index_1.default,
    paranoid: true,
    modelName: 'transaction',
    tableName: 'transaction',
    underscored: true,
});
exports.default = Transaction;
