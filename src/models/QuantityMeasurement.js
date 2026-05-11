const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const QuantityMeasurement = sequelize.define('QuantityMeasurement', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    thisValue: { type: DataTypes.DOUBLE, allowNull: true },
    thisUnit: { type: DataTypes.STRING, allowNull: true },
    thisMeasurementType: { type: DataTypes.STRING, allowNull: true },
    
    thatValue: { type: DataTypes.DOUBLE, allowNull: true },
    thatUnit: { type: DataTypes.STRING, allowNull: true },
    thatMeasurementType: { type: DataTypes.STRING, allowNull: true },
    
    operation: { type: DataTypes.STRING, allowNull: false }, // COMPARE, ADD, etc.
    
    resultString: { type: DataTypes.STRING, allowNull: true },
    resultValue: { type: DataTypes.DOUBLE, allowNull: true },
    resultUnit: { type: DataTypes.STRING, allowNull: true },
    resultMeasurementType: { type: DataTypes.STRING, allowNull: true },
    
    isError: { type: DataTypes.BOOLEAN, defaultValue: false },
    errorMessage: { type: DataTypes.TEXT, allowNull: true }
}, {
    timestamps: true,
    indexes: [
        { fields: ['operation'] },
        { fields: ['thisMeasurementType'] }
    ]
});

module.exports = QuantityMeasurement;