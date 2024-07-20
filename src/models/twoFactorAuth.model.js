const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('./user.model');


const TwoFactorAuth = sequelize.define('TwoFactorAuth', {
    two_fa_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    secret: {
        type: DataTypes.STRING,
        allowNull: false
    },
    method: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true,
});

User.hasOne(TwoFactorAuth, { foreignKey: 'user_id' });
TwoFactorAuth.belongsTo(User, { foreignKey: 'user_id' });


module.exports = TwoFactorAuth;