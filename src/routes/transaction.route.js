const express = require('express');
const { createTransfer, createDeposit, createWithdrawal, createBillPayment } = require('../controllers/transaction.controller')
const { authenticate } = require('../middlewares/auth.middleware');
const router = express.Router();

router.post('/transfer', authenticate, createTransfer);
router.post('/deposit', authenticate, createDeposit);
router.post('/withdrawal', authenticate, createWithdrawal);
router.post('/billpayment', authenticate, createBillPayment);

module.exports = router;