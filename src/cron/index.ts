import Batch from "../models/batch";
import Txn from "../models/transaction";
import moment from "moment";
import { CronJob, job } from "cron"
import { Op } from "sequelize";


class jobs {
    transaction() {
        const newCron = new CronJob('*/5 7-15 * * *', async function () {
            console.log(moment().format('YYYYY-MM-DD HH:mm:ss'), ' %d', 'TXN JOB STARTED')
            const startTime = moment().format('YYYYY-MM-HH HH:mm:ss')
            const endTime = moment().format('YYYYY-MM-HH 15:00:00')

            const seven_am = moment().format('YYYYY-MM-HH 12:00:00')
            const seven_am_unix = moment(seven_am, 'YYYYY-MM-HH HH:mm:ss').format('x')
            const two_45pm = moment().format('YYYYY-MM-HH 14:45:00')
            const two_45pm_unix = moment(two_45pm, 'YYYYY-MM-HH HH:mm:ss').format('x')
            



            const txn = await Txn.findAll({
                where: {
                    created_at:
                        { [Op.between]: [startTime, endTime] }
                }
            })

            let flag: "off_peak_hours" | "peak_hours" = "off_peak_hours"

            const rows = txn.map((r) => {

                const timer = moment(r.transaction_date, 'YYYYY-MM-HH HH:mm:ss').format('x')

                if (seven_am_unix <= timer || timer <= two_45pm_unix) {
                    flag = "peak_hours"
                }
                return { ...r, flag: flag }
            })

            const batchEntries = await Batch.bulkCreate(rows)

            console.log(moment().format('YYYYY-MM-DD HH:mm:ss'), ' %d', 'ROWS:', batchEntries.length)
            console.log(moment().format('YYYYY-MM-DD HH:mm:ss'), ' %d', 'TXN JOB COMPLETED')
        })
    }
}

const nJob = new jobs();

export default nJob.transaction;