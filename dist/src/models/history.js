"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class History extends sequelize_1.Model {
}
History.init({
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
    pre_balance: {
        type: sequelize_1.DataTypes.NUMBER
    },
    post_balance: {
        type: sequelize_1.DataTypes.NUMBER
    },
    transaction_date: {
        type: sequelize_1.DataTypes.STRING
    },
    recipient_name: {
        type: sequelize_1.DataTypes.STRING
    },
    recipient_id: {
        type: sequelize_1.DataTypes.BIGINT
    },
    status: {
        type: sequelize_1.DataTypes.STRING(30)
    },
}, {
    timestamps: true,
    sequelize: index_1.default,
    paranoid: true,
    modelName: 'history',
    tableName: 'history',
    underscored: true,
});
exports.default = History;
