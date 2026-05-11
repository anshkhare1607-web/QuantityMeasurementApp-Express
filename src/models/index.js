const sequelize = require('../config/database');
const User = require('./User');
const QuantityMeasurement = require('./QuantityMeasurement');

// Define associations
User.hasMany(QuantityMeasurement, { foreignKey: 'userId' });
QuantityMeasurement.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  QuantityMeasurement,
};
