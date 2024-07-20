const { DataTypes } = require('sequelize');
const { sequelize } = require('../utils/db');
const User = require('../models/user.model');

const AuthToken = sequelize.define('AuthToken', {
   token_id: {
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
   token: {
      type: DataTypes.STRING,
      allowNull: false
   },
   expires_at: {
      type: DataTypes.DATE,
      allowNull: false
   }
}, {
    timestamps: true,
});


User.hasMany(AuthToken, { foreignKey: 'user_id' });
AuthToken.belongsTo(User, { foreignKey: 'user_id' });


module.exports = AuthToken;