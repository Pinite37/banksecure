const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv');

dotenv.config();

const  authenticate = async (req, res, next) => {
    const authReader = req.header('Authorization');
    if (!authReader) return res.status(401).send('Access denied');
    
    const token = authReader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ where: { user_id: decoded.user_id } });
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user;
        next();
    } catch(error) {
        res.status(401).send({ error: 'Invalid token' });
    }
}


module.exports = {
    authenticate
};