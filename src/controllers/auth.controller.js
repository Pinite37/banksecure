const authService = require('../services/auth.service');
const logger = require('../utils/logger');


const createUser = async (req, res) => {
    try {
        const user = await authService.createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const loginUser = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        const user = await authService.loginUser(data);
        res.status(200).json(user);
    } catch (error) {
        logger.error("Failed to login attempt for user: " + data.username);
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const setupTwoFactorAuth = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = authService.verifToken(token);
        const user_id = decoded.user_id;
        const response = await authService.setupTwoFactorAuth(user_id);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const verifyTwoFactorAuth = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(401).json({ error: 'Unauthorized' });
        const decoded = authService.verifToken(token);
        const user_id = decoded.user_id;
        const { code } = req.body;
        const response = await authService.verifyTwoFactorAuth(user_id, code);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getAllUser = async (req, res) => {
    try {
        const user = await authService.getAllUser();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await authService.getUserById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};



module.exports = {
    createUser,
    loginUser,
    setupTwoFactorAuth,
    verifyTwoFactorAuth
}