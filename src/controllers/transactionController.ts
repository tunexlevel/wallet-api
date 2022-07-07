import axios from 'axios';
import User, { UserAttributes } from "../models/user";
import moment from 'moment';
import Wallet from '../models/wallet';
import WalletTransaction from '../models/transaction';
import sequelizeConnection from '../models/index'
import { Transaction } from 'sequelize/types';
import { randomBytes, pbkdf2Sync } from 'crypto';
import userController from './userController';
import HistoryTransaction from '../models/history'
import { Op } from 'sequelize'
import Batch from '../models/batch';

interface TransferType {
    amount: number,
    wallet_id: string
    description: string
    sender_wallet_id: number
    receiver_wallet_id: number
}

interface validTransferType {
    status: number,
    message: string,
    userId?: number,
    sName?: string,
    rName?: string,
    rBalance?: number,
    sBalance?: number,
    reason?: unknown
}

class transactionController extends userController {
    protected amount!: number
    protected description!: string
    protected sender_wallet_id!: number
    protected receiver_wallet_id!: number
    protected session_id!: number
    protected transaction_date!: string
    protected user_id!: string

    //setup new user with an active
    async transfer(data: TransferType) {

        this.amount = data.amount;
        this.sender_wallet_id = data.sender_wallet_id;
        this.receiver_wallet_id = data.receiver_wallet_id;



        const t: Transaction = await sequelizeConnection.transaction();

        try {
            //validate balance before fund transfer
            const check = await this.validateFundTransfer();

            const session_id = moment().format('x').toString() + check?.userId;

            const transaction_date = moment().format('YYYY-MM-DD HH:mm:ss');


            if (check.status !== 200 || !check?.userId 
                || !check?.sBalance 
                || !check?.rBalance 
                || !check?.rName
                || !check?.sName
            ) {
                if(check?.sName && check?.sBalance && check?.userId){
                    this.failedTxn(check.sName, check.sBalance, session_id, check.userId )
                }
                return check;
            }

            //save transaction
            await WalletTransaction.create({
                amount: this.amount,
                session_id: session_id,
                credit_wallet_id: this.receiver_wallet_id,
                debit_wallet_id: this.sender_wallet_id,
                user_id: check.userId,
                status: "Successful",
                transaction_date: transaction_date,
                created_at: new Date()
            }, { transaction: t })

            //decrease sender balance
            await Wallet.decrement(
                { balance: this.amount },
                { where: { wallet_id: this.sender_wallet_id }, transaction: t }
            )

            //increase receiver balance
            await Wallet.increment(
                { balance: this.amount },
                { where: { wallet_id: this.receiver_wallet_id }, transaction: t }
            )

            //create a transaction history for the sender
            await HistoryTransaction.create({
                session_id: session_id,
                user_id: this.sender_wallet_id,
                recipient_id: this.receiver_wallet_id,
                recipient_name: check.rName,
                status: "Successful",
                type: 'Debit',
                credit_wallet_id: this.receiver_wallet_id,
                debit_wallet_id: this.sender_wallet_id,
                amount: this.amount,
                transaction_date: transaction_date,
                pre_balance: check.sBalance,
                post_balance: check.sBalance - this.amount
            }, { transaction: t })

            //create a transaction history for the receiver
            await HistoryTransaction.create({
                session_id: session_id,
                user_id: this.receiver_wallet_id,
                type: 'Credit',
                recipient_id: this.sender_wallet_id,
                recipient_name: check.sName,
                status: "Successful",
                credit_wallet_id: this.receiver_wallet_id,
                debit_wallet_id: this.sender_wallet_id,
                amount: this.amount,
                transaction_date: transaction_date,
                pre_balance: check.rBalance,
                post_balance: check.rBalance + this.amount
            }, { transaction: t })

            const summary = {
                session_id,
                transaction_date,
                sender: check.sName,
                receiver: check.rName,
                amount: this.amount
            }

            await t.commit();

            return { status: 200, message: "Transfer Successful!", summary }
        }
        catch (e) {
            await t.rollback();
            return { status: 400, message: "Failed to transfer", reason: e }
        }
    }

    async getUserByWalletId(id: number) {

        try {
            const wallet = await Wallet.findOne({ attributes: ['user_id', 'balance'], where: [{ wallet_id: id }] });

            if (!wallet?.user_id) {

                return { status: 400, message: "User is not found", wallet }
            }

            const user = await User.findOne({ attributes: ['first_name', 'email', 'last_name', 'id'], where: [{ id: wallet.user_id }] });

            return { status: 200, name: user?.first_name + ' ' + user?.last_name, balance: wallet.balance, user_id: user?.id, email: user?.email }
        }
        catch (e) {
            return { status: 400, message: "failed to get wallet id details", reason: e }
        }
    }


    async validateFundTransfer(): Promise<validTransferType> {
        try {
            const sendUser = await this.getUserByWalletId(this.sender_wallet_id);

            if (!sendUser?.user_id) {
                return { status: 400, message: "Sender Id is not found" };
            }
            else if (this.amount === 0) {
                return { status: 400, message: "You can't send zero amount" };
            }
            else if ((sendUser.balance - this.amount) < 0) {

                return { status: 400, message: "Insuffucient fund" };
            }

            const receiveUser = await this.getUserByWalletId(this.receiver_wallet_id);

            if (!receiveUser?.user_id) {
                return { status: 400, message: "Receiver Id is not found" };
            }

            return { status: 200, message: "ok", userId: sendUser.user_id, sName: sendUser.name, rName: receiveUser.name, sBalance: sendUser.balance, rBalance: receiveUser.balance };

        } catch (e: unknown) {
            return { status: 400, message: "failed to validate user", reason: e }
        }
    }

    async txnHistory(id: number) {
        const user = await Wallet.findOne({ where: {[Op.or]: [{ wallet_id: id }, {user_id: id}]} })
        if(!user?.user_id){
            return {status: 400, message: "User id not found"}
        }
        const txnHistory = await HistoryTransaction.findAll({attributes:['amount', 'type', 'transaction_date', 'user_id', 'recipient_id', 'recipient_name', 'status'], where: { user_id: id } });

        return {status: 200, history:txnHistory}
    }

    async txnJobs() {
        const txns = await Batch.findAll({attributes:
            ['id', 'user_id', 'type', 'flag', 'session_id',
            'credit_wallet_id', 'debit_wallet_id', 
            'amount', 'transaction_date', 'status', 'created_at']
        });
        if(txns.length < 1){
            return {status: 200, message: "No jobs found yet"}
        }

        return {status: 200, lists: txns}
    }

    async failedTxn(name:string, balance:number, session_id: string, user_id: number) {
        await WalletTransaction.create({
            amount: this.amount,
            session_id: session_id,
            credit_wallet_id: this.receiver_wallet_id,
            debit_wallet_id: this.sender_wallet_id,
            user_id: user_id,
            status: "Failed",
            transaction_date: this.transaction_date,
            created_at: new Date()
        })

        await HistoryTransaction.create({
            session_id: session_id,
            user_id: this.sender_wallet_id,
            recipient_id: this.receiver_wallet_id,
            recipient_name: name,
            status: "Failed",
            type: 'Debit',
            credit_wallet_id: this.receiver_wallet_id,
            debit_wallet_id: this.sender_wallet_id,
            amount: this.amount,
            transaction_date: this.transaction_date,
            pre_balance: balance,
            post_balance: balance
        })
    }

}


export default transactionController;

