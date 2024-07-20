const User = require('../models/user.model')
const Account = require('../models/account.model')
const { generateNumber } = require('../utils/genarateAccountNumber')
const logger = require('../utils/logger');


const createAccount = async (user_id, data) => {
    try {
        const user = await User.findOne({ where: { user_id : user_id } });
        if (user) {
            account_number = generateNumber()
            const account = await Account.create({
                user_id,
                account_number: account_number,
                account_type: data.account_type,
                balance: data.balance
            });
            return account;
        } else {
          logger.error('User not found')
          throw new Error('User not found')
        }
    } catch (error) {
        console.log(error)
        logger.error('Error creating account')
        throw new Error('Error creating account')
    }
}

const getAllAccount = async () => {
    logger.info('Getting all accounts')
    return await Account.findAll();

}

const getAccount = async(id) => {
    try {
      const account = await Account.findByPk(id);
      if (!account) {
        logger.error('Account not found')
        throw new Error('Account not found');
      }
      return account;
    } catch (error) {
      logger.error('Unable to get account')
      throw new Error('unable to get account');
    }
}

const updateAccount = async(id, data) => {
    const {account_number, account_type, balance} = updateData
    try {
      const account = await Account.findByPk(id);
      if (!account) {
        logger.error('Account not found')
        throw new Error('Account not found');
      }
      const update = await Account.update({account_number, account_type, balance});
      return update;
    } catch (error) {
      logger.error('Error editing account')
      throw new Error('Error editing account');
    }
}

const deleteAccount = async (id) => {
    try {
      const account = await Account.findByPk(id);
      if (!account) {
        logger.error('Account not found')
        throw new Error('Account not found');
      }
      const destroy = await account.destroy();
      return destroy
    } catch (error) {
      logger.error('Error deleting account')
      throw new Error('Error deleting account');
    }
};
  module.exports = {createAccount, getAllAccount, getAccount, updateAccount, deleteAccount}
