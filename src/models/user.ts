import { DataTypes, Model, Optional } from 'sequelize'
import sequelizeConnection from './index'



export interface UserAttributes {
  id: number,
  first_name: string,
  last_name: string,
  status: string,
  email: string,
  password: string,
  salt: string,
  token?: string,
}

export interface UserInput extends Optional<UserAttributes, 'id'> { }
export interface UserOutput extends Required<UserAttributes> { }


class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: number
  public first_name!: string
  public last_name!: string
  public status!: string
  public email!: string
  public password!: string
  public salt!: string
  public token!: string

  // timestamps!
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init({
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.STRING
  },
  first_name: {
    type: DataTypes.STRING
  },
  last_name: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  salt: {
    type: DataTypes.STRING
  },
  token: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  sequelize: sequelizeConnection,
  modelName: 'user',
  tableName: 'user',
  underscored: true,
  paranoid: true
});

export default User;