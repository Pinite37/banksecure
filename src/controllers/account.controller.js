const {createAccount, getAllAccount, getAccount, updateAccount, deleteAccount} = require('../services/account.service');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const create = async (req, res) => {
    try {
        const authReader = req.header('Authorization');
        if (!authReader) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authReader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id;

        const account = await createAccount(user_id, req.body);
        
        res.status(201).json(account);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const account = await getAllAccount();
        res.status(200).json(account);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const getById = async (req, res) => {
    try {
        const account = await getAccount(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


const update = async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const update = await updateAccount(id, updateData);
      res.status(200).json(update);;
    } catch (error) {
      res.status(500).json({ message: error.message });
      
    }
  };


const del = async (req, res) => {
    try {
        const account = await deleteAccount(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found' });
        }
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    create,
    getAll,
    getById,
    update,
    del
};