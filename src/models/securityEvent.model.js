const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');
const User = require('../models/user.model');

const SecurityEvent = sequelize.define('SecurityEvent', {
   event_id: {
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
   event_type: {
      type: DataTypes.STRING,
      allowNull: false
   },
   event_description: {
      type: DataTypes.TEXT,
      allowNull: false
   },
}, {
    timestamps: true,
});

User.hasMany(SecurityEvent, { foreignKey: 'user_id' });
SecurityEvent.belongsTo(User, { foreignKey: 'user_id' });


module.exports = SecurityEvent;