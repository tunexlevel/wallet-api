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
const batch_1 = __importDefault(require("../models/batch"));
const transaction_1 = __importDefault(require("../models/transaction"));
const moment_1 = __importDefault(require("moment"));
const cron_1 = require("cron");
const sequelize_1 = require("sequelize");
class jobs {
    transaction() {
        return __awaiter(this, void 0, void 0, function* () {
            const newCron = new cron_1.CronJob('*/5 7-15 * * *', function () {
                return __awaiter(this, void 0, void 0, function* () {
                    console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), 'TXN JOB STARTED');
                    const startTime = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
                    const endTime = (0, moment_1.default)().format('YYYY-MM-DD 15:00:00');
                    const seven_am = (0, moment_1.default)().format('YYYY-MM-DD 12:00:00');
                    const seven_am_unix = (0, moment_1.default)(seven_am, 'YYYY-MM-DD HH:mm:ss').format('x');
                    const two_45pm = (0, moment_1.default)().format('YYYY-MM-DD 14:45:00');
                    const two_45pm_unix = (0, moment_1.default)(two_45pm, 'YYYY-MM-DD HH:mm:ss').format('x');
                    try {
                        const txn = yield transaction_1.default.findAll({
                            where: {
                                created_at: { [sequelize_1.Op.between]: [startTime, endTime] },
                                amount: { [sequelize_1.Op.gt]: 1500 }
                            }
                        });
                        let flag = "off_peak_hours";
                        const rows = txn.map((r) => {
                            const timer = (0, moment_1.default)(r.transaction_date, 'YYYY-MM-DD HH:mm:ss').format('x');
                            console.log(r.transaction_date, timer);
                            if (seven_am_unix <= timer || timer <= two_45pm_unix) {
                                flag = "peak_hours";
                            }
                            return Object.assign(Object.assign({}, r.get()), { flag: flag });
                        });
                        let batchEntries = [];
                        console.log(rows);
                        if (rows.length > 0) {
                            batchEntries = yield batch_1.default.bulkCreate(rows, { ignoreDuplicates: true });
                        }
                        console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), 'ROWS:', batchEntries.length);
                        console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), 'TXN JOB COMPLETED');
                    }
                    catch (e) {
                        console.log(e);
                        console.log((0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss'), 'TXN JOB FAILED');
                    }
                });
            });
            newCron.start();
        });
    }
}
const nJob = new jobs();
exports.default = nJob.transaction;
