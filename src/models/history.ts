import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from './index'



interface HistoryAttributes {
  session_id: string,
  user_id: number,
  type: 'Credit' | 'Debit',
  credit_wallet_id: number,
  debit_wallet_id: number,
  amount: number,
  transaction_date: string,
  pre_balance: number,
  post_balance: number,
  status: 'Successful' | 'Failed',
  recipient_name: string,
  recipient_id: number,
}

export interface HistoryInput extends Required<HistoryAttributes> { }
export interface HistoryOutput extends Required<HistoryAttributes> { }


class History extends Model<HistoryAttributes, HistoryInput> implements HistoryAttributes {
  public session_id!: string
  public user_id!: number
  public type!: 'Credit' | 'Debit'
  public credit_wallet_id!: number
  public debit_wallet_id!: number
  public amount!: number
  public transaction_date!: string
  public pre_balance!: number
  public post_balance!: number
  public recipient_name!: string
  public recipient_id!: number
  public status!: 'Successful' | 'Failed'
  

  // timestamps!
  public readonly created_at!: Date;
}

History.init({
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
  pre_balance: {
    type: DataTypes.NUMBER
  },
   post_balance: {
    type: DataTypes.NUMBER
  },
  transaction_date: {
    type: DataTypes.STRING
  },
  recipient_name: {
    type: DataTypes.STRING
  },
  recipient_id: {
    type: DataTypes.BIGINT
  },
  status: {
    type: DataTypes.STRING(30)
  },
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true,
  modelName: 'history',
  tableName: 'history',
  underscored: true,
});

export default History;