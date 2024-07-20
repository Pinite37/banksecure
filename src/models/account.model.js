const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./user.model');


const Account = sequelize.define('Account', {
    account_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    account_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    balance: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0.00,
    },
}, {
    timestamps: true,
});

User.hasMany(Account, { foreignKey: 'user_id' });
Account.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Account;