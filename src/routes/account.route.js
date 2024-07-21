const express = require('express');
const { create, getAll, getById, update, del } = require('../controllers/account.controller')
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware')
const csrfProtection = require('csurf')({ cookie: true });


router.get('/:id', authenticate, csrfProtection, getById);
router.get('/', authenticate, csrfProtection, getAll);
router.post('/', authenticate, csrfProtection, create);
router.put('/:id', authenticate, csrfProtection, update);
router.delete('/:id', authenticate,  csrfProtection, del);


module.exports = router;