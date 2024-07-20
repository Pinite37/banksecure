const transferService = require('../services/transaction.service')


const createTransfer = async (req, res) => {
    const { from_account_id, to_account_id, amount } = req.body;
    try {
        const transfer = await transferService.transferFunds(from_account_id, to_account_id, amount);
        res.status(201).json(transfer);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const createDeposit = async (req, res) => {
    const { to_account_id, amount } = req.body;
    try {
        const deposit = await transferService.depositFunds(to_account_id, amount);
        res.status(201).json(deposit);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const createWithdrawal = async (req, res) => {
    const { from_account_id, amount } = req.body;
    console.log(from_account_id)
    try {
        const withdrawal = await transferService.withdrawFunds(from_account_id, amount);
        res.status(201).json(withdrawal);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const createBillPayment = async (req, res) => {
    const { from_account_id, amount, biller } = req.body;
    try {
        const billPayment = await transferService.payBill(from_account_id, amount, biller);
        res.status(201).json(billPayment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransfer,
    createDeposit,
    createWithdrawal,
    createBillPayment
}