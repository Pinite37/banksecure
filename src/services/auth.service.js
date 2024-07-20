const speakeasy = require('speakeasy')
const User = require('../models/user.model')
const UserProfile = require('../models/userProfile.model')
const bcrypt = require('bcryptjs')
const { generateToken, verifyToken } = require('../utils/jwt')
const moment = require('moment')
const AuthToken = require('../models/authToken.model')
const TwoFactorAuth = require('../models/twoFactorAuth.model')
const logger = require('../utils/logger');


const createUser = async (data) => {
    const hashedPassword = bcrypt.hashSync(data.password, 10);
    const formattedDate = moment(data.birthdate, 'DD/MM/YYYY').toISOString();

    const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
    })

    const userProfile = await UserProfile.create({
        user_id: user.user_id,
        first_name: data.firstName,
        last_name: data.lastName,
        address: data.address,
        sex: data.sex,
        phone: data.phone,
        dob: formattedDate,
    })

    logger.info('User created: ' + data.username);
    return { userProfile };

}

const loginUser = async (data) => {
    const user = await User.findOne({ where: { username: data.username } });
    if (!user) {
        logger.error('Failed to login attempt for user: ' + data.username);
        throw new Error('Invalid username or password');
    }

    const isPasswordValid = bcrypt.compareSync(data.password, user.password);
    if (!isPasswordValid) {
        logger.error('Failed to login attempt for user: ' + data.username);
        throw new Error('Invalid username or password');
    }

    const token = generateToken({ user_id: user.user_id });

    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + 1);

    await AuthToken.create({
        user_id: user.user_id,
        token: token,
        expires_at: expireAt,
    });
    logger.info('Login successful for user: ' + data.username);

    return { token };
}

const setupTwoFactorAuth = async (user_id) => {
    const secret = speakeasy.generateSecret({ length: 20 });
    await TwoFactorAuth.create({
        user_id,
        secret: secret.base32,
        method: 'totp'
    });

    return { secret: secret.base32 }; 
}

const verifyTwoFactorAuth = async (user_id, token) => {
    const twoFactorAuth = await TwoFactorAuth.findOne({ where: { user_id } });
    if (!twoFactorAuth) {
        throw new Error('Two-factor authentication not set up');
    }

    const verified = speakeasy.totp.verify({
        secret: twoFactorAuth.secret,
        encoding: 'base32',
        token
    });

    if (!verified) {
        throw new Error('Invalid two-factor authentication token');
    }

    logger.info('Two-factor authentication verified for user: ' + user_id);


    return { verified };
}

const verifToken = (token) => {
    try {
        const decoded = verifyToken(token);
        return decoded;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

const getAllUser = async () => {
    const user = await User.findAll();
    logger.info('Get all user');
    return user;
}

const getUserById = async (id) => {
    const user = await User.findByPk(id);
    logger.info('Get user by id: ' + id);
    return user;
}

const deleteUser = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        logger.error('User not found: ' + id);
        throw new Error('User not found');
    }
    await user.destroy();
    logger.info('User deleted: ' + id);
    return { message: 'User deleted successfully' };
}

module.exports = {
    createUser,
    loginUser,
    setupTwoFactorAuth,
    verifyTwoFactorAuth,
    verifToken,
    getAllUser,
    getUserById,
    deleteUser
}