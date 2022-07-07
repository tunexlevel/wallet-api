import moment from 'moment'
import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from './index'



interface TransactionAttributes {
  session_id: string,
  user_id: number,
  type?: 'Transfer' | 'Deposit',
  credit_wallet_id: number,
  debit_wallet_id: number,
  amount: number,
  transaction_date: string,
  created_at: Date,
  status: 'Successful' | 'Failed',
}

export interface TransactionInput extends Optional<TransactionAttributes, 'transaction_date'|'type'> { }
export interface TransactionOutput extends Required<TransactionAttributes> { }


class Transaction extends Model<TransactionAttributes, TransactionInput> implements TransactionAttributes {
  public session_id!: string
  public user_id!: number
  public type: 'Transfer' | 'Deposit' = 'Transfer'
  public credit_wallet_id!: number
  public debit_wallet_id!: number
  public amount!: number
  public transaction_date!: string
  public status!: 'Successful' | 'Failed'
  public created_at!: Date;

  // timestamps!
  
  public readonly updated_at!: Date;
}

Transaction.init({
  session_id: {
    type: DataTypes.STRING
  },
  user_id: {
    type: DataTypes.NUMBER
  },
  type: {
    type: DataTypes.STRING
  },
  credit_wallet_id: {
    type: DataTypes.NUMBER
  },
  debit_wallet_id: {
    type: DataTypes.NUMBER
  },
  amount: {
    type: DataTypes.NUMBER
  },
  transaction_date: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING(30)
  },
  created_at: {
    type: DataTypes.DATE
  },
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true,
  modelName: 'transaction',
  tableName: 'transaction',
  underscored: true,
});

export default Transaction;