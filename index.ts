import dotenv from "dotenv";
import startJobs from "./src/cron/index"
import moment from "moment";


dotenv.config()

console.log(moment().format('YYYY-MM-DD HH:mm:ss'),  'SERVIC JOB RUNNING')

startJobs();




