import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from './index'



interface WalletAttributes {
  user_id: number,
  wallet_id: number,
  balance: number,
}

export interface WalletInput extends Required<WalletAttributes> { }
export interface WalletOutput extends Required<WalletAttributes> { }


class Wallet extends Model<WalletAttributes, WalletInput> implements WalletAttributes {
  public user_id!: number
  public wallet_id!: number
  public balance!: number

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Wallet.init({
  user_id: {
    type: DataTypes.NUMBER
  },
  wallet_id: {
    type: DataTypes.NUMBER
  },
  balance: {
    type: DataTypes.NUMBER
  },
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  paranoid: true,
  modelName: 'wallet',
  tableName: 'wallet',
  underscored: true,
});


export default Wallet;