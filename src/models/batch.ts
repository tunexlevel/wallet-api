import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from './index'



interface BatchAttributes {
  session_id: string,
  user_id: number,
  type: string,
  flag: 'peak_hours' | 'off_peak_hours',
  credit_wallet_id: number,
  debit_wallet_id: number,
  amount: number,
  transaction_date: string,
  created_at: Date,
  status: 'Successful' | 'Failed',

}

export interface BatchInput extends Required<BatchAttributes> { }
export interface BatchOutput extends Required<BatchAttributes> { }


class Batch extends Model<BatchAttributes, BatchInput> implements BatchAttributes {
  public session_id!: string
  public user_id!: number
  public type!: string
  public flag: 'peak_hours' | 'off_peak_hours' = 'off_peak_hours'
  public credit_wallet_id!: number
  public debit_wallet_id!: number
  public amount!: number
  public transaction_date!: string
  public status!: 'Successful' | 'Failed'
  public created_at!: Date;

  // timestamps!
  public readonly updated_at!: Date;
}

Batch.init({
  session_id: {
    type: DataTypes.STRING
  },
  user_id: {
    type: DataTypes.NUMBER
  },
  type: {
    type: DataTypes.STRING
  },
  flag: {
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
  modelName: 'batch',
  tableName: 'batch',
  underscored: true,
});

export default Batch;