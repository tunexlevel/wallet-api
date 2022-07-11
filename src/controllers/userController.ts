import axios from 'axios';
import User, { UserAttributes } from "../models/user";
import moment from 'moment';
import Wallet from '../models/wallet';
import sequelizeConnection from '../models/index'
import { Transaction } from 'sequelize/types';
import { randomBytes, pbkdf2Sync } from 'crypto';

class userController {
    protected first_name!: string
    protected last_name!: string
    protected email!: string
    protected password!: string
    protected wallet_id!: number

    //setup new user with an active
    async createUser(data: UserAttributes) {

        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.password = data.password;

        const check = await User.findOne({attributes:['id'], where:{email:this.email}})

        if(check?.id){
            return {status: 400, message: "The user email already exist"}
        }

        const t: Transaction = await sequelizeConnection.transaction();

        try {

            const salt = randomBytes(16).toString('hex');
            const hash = pbkdf2Sync(this.password, salt, 1000, 64, `sha512`).toString(`hex`);
            const user = await User.create({
                first_name: this.first_name,
                last_name: this.last_name,
                status: 'Active',
                email: this.email,
                password: hash,
                salt: salt
            }, { transaction: t })

            const wallet = await Wallet.findOne({ order: [['id', 'DESC']], limit: 1 });

            const wallet_id = wallet ? wallet.wallet_id + 1 : 100000000;

            await Wallet.create({
                user_id: user.id,
                wallet_id: wallet_id,
                balance: 100000
            }, { transaction: t })

            await t.commit();

            return { status: 200, message: "The user was created successfully", wallet_id}
        }
        catch (e) {
            await t.rollback();
            return { status: 400, message: "failed to create account", reason: e }
        }
    }

    async login (data: UserAttributes) {

        this.email = data.email;
        this.password = data.password;

        const check = await User.findOne({attributes:['id', 'salt', 'password'], where:{email:this.email}})

        if(!check?.id){
            return {status: 400, message: "Invalid login credentails"}
        }

        if(!this.validatePassword(this.password, check.salt, check.password)){
            return {status: 400, message: "Invalid login credentails"}
        }

        const salt = randomBytes(16).toString('hex');
        const password = pbkdf2Sync(this.password, salt, 1000, 64, `sha512`).toString(`hex`);
        const token = pbkdf2Sync(this.email, salt, 1000, 64, `sha512`).toString(`hex`);

        try {
            
            await User.update({
                password: password,
                salt: salt,
                token: token
            }, { where: {email: this.email} })


            return { status: 200, message: "The user was login successfully", token}
        }
        catch (e) {
            return { status: 400, message: "Failed to login account", reason: e }
        }
    }

    async getUserByWalletId(id: number) {

        try {

            const wallet = await Wallet.findOne({attributes:['user_id'], where: [{ wallet_id: id }] });

            if (!wallet?.user_id) {
                 
                return { status: 400, message: "User is not found", wallet }
            }

            const user = await User.findOne({attributes:['first_name', 'email', 'last_name', 'id'], where: [{ id: wallet.user_id }] });

            return { status: 200, name: user?.first_name + ' ' + user?.last_name, user_id: user?.id, email: user?.email }
        }
        catch (e) {
            return { status: 400, message: "failed to get wallet id details", reason: e }
        }
    }

    async validateToken(token: string) {

        try{
            const user = await User.findOne({attributes:['email', 'last_seen', 'id'], where: [{ token }] });

            if(!user?.id || user.last_seen === ''){
                return {status: 400, message: "Invalid token!"}
            }
            
            const timeInterval = moment().diff(user.last_seen, 'minutes')
    
            if(timeInterval > 15){
                return {status: 400, message: "Inactive for a while, kindly login again!"}
            }
    
            user.update({last_seen: moment().format('YYYY-MM-DD HH:mm:ss')})
    
            return {status: 200, message: "Active user!"}
        }
        catch(e){
            return {status: 400, message: "Failed to fetch user"}
        }

        
    }

    validatePassword(password: string, salt: string, originalPassword: string) {
        const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
        return hash === originalPassword;
    }

}


export default userController;

