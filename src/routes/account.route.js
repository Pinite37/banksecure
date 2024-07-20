const express = require('express');
const { create, getAll, getById, update, del } = require('../controllers/account.controller')
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware')


router.get('/:id', authenticate, getById);
router.get('/', authenticate, getAll);
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, del);


module.exports = router;