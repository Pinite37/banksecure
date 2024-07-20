const express = require('express');
const { createUser, loginUser, setupTwoFactorAuth, verifyTwoFactorAuth } = require('../controllers/auth.controller')
const router = express.Router();


router.post('/signup', createUser);
router.post('/login', loginUser);
router.post('/2fa/setup', setupTwoFactorAuth);
router.post('/2fa/verify', verifyTwoFactorAuth);


module.exports = router;