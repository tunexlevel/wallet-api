"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const index_1 = __importDefault(require("./index"));
class Wallet extends sequelize_1.Model {
}
Wallet.init({
    user_id: {
        type: sequelize_1.DataTypes.NUMBER
    },
    wallet_id: {
        type: sequelize_1.DataTypes.NUMBER
    },
    balance: {
        type: sequelize_1.DataTypes.NUMBER
    },
}, {
    timestamps: true,
    sequelize: index_1.default,
    paranoid: true,
    modelName: 'wallet',
    tableName: 'wallet',
    underscored: true,
});
exports.default = Wallet;
