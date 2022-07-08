import { Dialect, Sequelize } from 'sequelize'
import dotenv from "dotenv";

dotenv.config()

const dbName = process.env.DB_NAME as string
const dbUser = process.env.DB_USER as string
const dbHost = process.env.DB_HOST
const dbDriver = process.env.DB_DRIVER as Dialect
const dbPassword = process.env.DB_PASSWORD

let options = {
    host: dbHost,
    dialect: dbDriver,
    username: dbUser,
    password: dbPassword,
    database: dbName,
    dialectOptions: { }
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
  }
}

console.log(options)

const sequelizeConnection = new Sequelize(options)

export default sequelizeConnection