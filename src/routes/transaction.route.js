const express = require('express');
const { createTransfer, createDeposit, createWithdrawal, createBillPayment } = require('../controllers/transaction.controller')
const { authenticate } = require('../middlewares/auth.middleware');
const csrfProtection = require('csurf')({ cookie: true });
const router = express.Router();

router.post('/transfer', authenticate, csrfProtection, createTransfer);
router.post('/deposit', authenticate, csrfProtection, createDeposit);
router.post('/withdrawal', authenticate, csrfProtection, createWithdrawal);
router.post('/billpayment', authenticate, csrfProtection, createBillPayment);

module.exports = router;