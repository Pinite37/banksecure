const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const Account = require('./account.model');

const Transaction = sequelize.define('Transaction', {
    transaction_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    from_account_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Account,
            key: 'account_id',
        },
    },
    to_account_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Account,
            key: 'account_id',
        },
    },
    amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    transaction_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biller: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: true,
});

Account.hasMany(Transaction, { as: 'fromtransactions', foreignKey: 'from_account_id' });
Account.hasMany(Transaction, { as: 'totransactions', foreignKey: 'to_account_id' });

Transaction.belongsTo(Account, { as: 'fromaccount', foreignKey: 'from_account_id' });
Transaction.belongsTo(Account, { as: 'toaccount', foreignKey: 'to_account_id' });

module.exports = Transaction;