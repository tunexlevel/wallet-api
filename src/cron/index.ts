import Batch from "../models/batch";
import Txn from "../models/transaction";
import moment from "moment";
import { CronJob } from "cron"
import { Op } from "sequelize";


class jobs {
    async transaction() {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'Cron Job Seen')
        
        const newCron = new CronJob('*/1 * * * *', async function () {
            console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'TXN JOB STARTED')
            const startTime = moment().format('YYYY-MM-DD HH:mm:ss')
            const endTime = moment().format('YYYY-MM-DD 15:00:00')

            const seven_am = moment().format('YYYY-MM-DD 12:00:00')
            const seven_am_unix = moment(seven_am, 'YYYY-MM-DD HH:mm:ss').format('x')
            const two_45pm = moment().format('YYYY-MM-DD 14:45:00')
            const two_45pm_unix = moment(two_45pm, 'YYYY-MM-DD HH:mm:ss').format('x')
            
            try{
                const txn = await Txn.findAll({
                    where: {
                        created_at:
                            { [Op.between]: [startTime, endTime] }
                    }
                })
    
                let flag: "off_peak_hours" | "peak_hours" = "off_peak_hours"
    
                const rows = txn.map((r) => {
                    
                    const timer = moment(r.transaction_date, 'YYYY-MM-DD HH:mm:ss').format('x')

                    console.log(r.transaction_date, timer)
    
                    if (seven_am_unix <= timer || timer <= two_45pm_unix) {
                        flag = "peak_hours"
                    }
                    return { ...r, flag: flag }
                })
    
                let batchEntries = [];
                if(rows.length > 0){
                     batchEntries = await Batch.bulkCreate(rows)
                }
    
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'ROWS:', batchEntries.length)
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'TXN JOB COMPLETED')
            }
            catch(e){
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'TXN JOB FAILED')
            }
        })

        newCron.start();
    }
}

const nJob = new jobs();

export default nJob.transaction;