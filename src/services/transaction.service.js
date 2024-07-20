const { sequelize } = require('../utils/db')
const Transaction = require('../models/transaction.model')
const Account = require('../models/account.model')
const logger = require('../utils/logger')

const transferFunds = async (fromAccountId, toAccountId, amount) => {
    const t = await sequelize.transaction()
    console.log(fromAccountId)

    try {
        const fromAccount = await Account.findByPk(fromAccountId, { transaction: t })
        const toAccount = await Account.findByPk(toAccountId, { transaction: t })

        if (!fromAccount || !toAccount) {
            throw new Error('One or both accounts not found')
        }

        if (fromAccount.balance < amount) {
            throw new Error('Insufficient funds in the source account')
        }

        fromAccount.balance -= amount
        toAccount.balance += amount

        await fromAccount.save({ transaction: t })
        await toAccount.save({ transaction: t })

        const transferTransaction = await Transaction.create({
            from_account_id: fromAccountId,
            to_account_id: toAccountId,
            amount: amount,
            transaction_type: 'transfer',
            status: 'success'
        }, { transaction: t })

        await t.commit()

        logger.info('Tranfer completed', { fromAccountId, toAccountId, amount })

        return transferTransaction
    } catch (error) {
        await t.rollback()
        logger.error(`Error transferring funds: ${error.message}`)
        throw error
    }
}

const depositFunds = async (accountId, amount) => {
    const t = await sequelize.transaction()

    try {
        const account = await Account.findByPk(accountId, { transaction: t })

        if (!account) {
            throw new Error('Account not found')
        }

        account.balance += amount

        await account.save({ transaction: t })

        const depositTransaction = await Transaction.create({
            to_account_id: accountId,
            amount,
            transaction_type: 'deposit',
            status: 'success'
        }, { transaction: t })

        await t.commit()

        logger.info('Deposit completed', { accountId, amount })

        return depositTransaction
    } catch (error) {
        await t.rollback()
        logger.error(`Error depositing funds: ${error.message}`)
        throw error
    }
}


const withdrawFunds = async (accountId, amount) => {
    const t = await sequelize.transaction()

    try {
        const account = await Account.findByPk(accountId, { transaction: t })

        if (!account) {
            throw new Error('Account not found')
        }

        if (account.balance < amount) {
            throw new Error('Insufficient funds')
        }

        account.balance -= amount

        await account.save({ transaction: t })

        const withdrawTransaction = await Transaction.create({
            from_account_id: accountId,
            amount,
            transaction_type: 'withdraw',
            status: 'success'
        }, { transaction: t })

        await t.commit()

        logger.info('Withdrawal completed', { accountId, amount })

        return withdrawTransaction
    } catch (error) {
        await t.rollback()
        logger.error(`Error withdrawing funds: ${error.message}`)
        throw error
    }
}

const payBill = async (fromAccountId, amount, biller) => {
    const t = await sequelize.transaction()

    try {
        const account = await Account.findByPk(fromAccountId, { transaction: t })

        if (!account) {
            throw new Error('Account not found')
        }

        if (account.balance < amount) {
            throw new Error('Insufficient funds')
        }

        account.balance -= amount

        await account.save({ transaction: t })

        const billPaymentTransaction = await Transaction.create({
            from_account_id: fromAccountId,
            amount,
            transaction_type: 'bill_payment',
            biller,
            status: 'success'
        }, { transaction: t })

        await t.commit()

        logger.info('Bill payment completed', { fromAccountId, amount })

        return billPaymentTransaction
    } catch (error) {
        await t.rollback()
        logger.error(`Error paying bill: ${error.message}`)
        throw error
    }
}

module.exports = {
    transferFunds,
    depositFunds,
    withdrawFunds,
    payBill
}