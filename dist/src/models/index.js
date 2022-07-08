"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbHost = process.env.DB_HOST;
const dbDriver = process.env.DB_DRIVER;
const dbPassword = process.env.DB_PASSWORD;
let options = {
    host: dbHost,
    dialect: dbDriver,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    dialectOptions: {}
};
if (process.env.NODE_ENV === 'production') {
    options = {
        host: dbHost,
        dialect: dbDriver,
        username: dbUser,
        password: dbPassword,
        database: dbName,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    };
}
const sequelizeConnection = new sequelize_1.Sequelize(options);
exports.default = sequelizeConnection;
