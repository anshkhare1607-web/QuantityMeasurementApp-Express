const { MEASUREMENT_TYPES } = require('../utils/unitConstants');

class QuantityService {
    
    // Helper: Temperature conversions
    convertTemperature(value, fromUnit, toUnit) {
        if (fromUnit === toUnit) return value;
        if (fromUnit === 'CELSIUS' && toUnit === 'FAHRENHEIT') return (value * 9/5) + 32;
        if (fromUnit === 'FAHRENHEIT' && toUnit === 'CELSIUS') return (value - 32) * 5/9;
        throw new Error('Invalid temperature conversion');
    }

    // Helper: Convert to Base Unit
    convertToBase(value, unit, type) {
        if (type === 'TemperatureUnit') return value; // Handled separately
        const conversionFactor = MEASUREMENT_TYPES[type][unit];
        if (!conversionFactor) throw new Error(`Invalid unit: ${unit} for type: ${type}`);
        return value * conversionFactor;
    }

    // Helper: Convert from Base to Target Unit
    convertFromBase(baseValue, targetUnit, type) {
        if (type === 'TemperatureUnit') return baseValue; 
        const conversionFactor = MEASUREMENT_TYPES[type][targetUnit];
        if (!conversionFactor) throw new Error(`Invalid target unit: ${targetUnit}`);
        const result = baseValue / conversionFactor;
        return Number(result.toFixed(4)); // Round to 4 decimal places
    }

    compare(q1, q2) {
        if (q1.measurementType !== q2.measurementType) {
            throw new Error(`Cannot compare different measurement categories: ${q1.measurementType} and ${q2.measurementType}`);
        }
        
        if (q1.measurementType === 'TemperatureUnit') {
            const convertedQ1 = this.convertTemperature(q1.value, q1.unit, 'CELSIUS');
            const convertedQ2 = this.convertTemperature(q2.value, q2.unit, 'CELSIUS');
            return Math.abs(convertedQ1 - convertedQ2) < 0.01;
        }

        const baseVal1 = this.convertToBase(q1.value, q1.unit, q1.measurementType);
        const baseVal2 = this.convertToBase(q2.value, q2.unit, q2.measurementType);
        return Math.abs(baseVal1 - baseVal2) < 0.001; 
    }

    convert(q1, targetUnit) {
        if (q1.measurementType === 'TemperatureUnit') {
            return this.convertTemperature(q1.value, q1.unit, targetUnit);
        }
        const baseVal = this.convertToBase(q1.value, q1.unit, q1.measurementType);
        return this.convertFromBase(baseVal, targetUnit, q1.measurementType);
    }

    add(q1, q2, targetUnit = null) {
        if (q1.measurementType !== q2.measurementType) throw new Error('Cannot add different measurement categories');
        if (q1.measurementType === 'TemperatureUnit') throw new Error('Cannot add temperatures');

        const baseVal1 = this.convertToBase(q1.value, q1.unit, q1.measurementType);
        const baseVal2 = this.convertToBase(q2.value, q2.unit, q2.measurementType);
        const resultBase = baseVal1 + baseVal2;
        
        const finalUnit = targetUnit || q1.unit;
        return this.convertFromBase(resultBase, finalUnit, q1.measurementType);
    }

    subtract(q1, q2, targetUnit = null) {
        if (q1.measurementType !== q2.measurementType) throw new Error('Cannot subtract different measurement categories');
        if (q1.measurementType === 'TemperatureUnit') throw new Error('Cannot subtract temperatures');

        const baseVal1 = this.convertToBase(q1.value, q1.unit, q1.measurementType);
        const baseVal2 = this.convertToBase(q2.value, q2.unit, q2.measurementType);
        const resultBase = baseVal1 - baseVal2;
        
        const finalUnit = targetUnit || q1.unit;
        return this.convertFromBase(resultBase, finalUnit, q1.measurementType);
    }

    divide(q1, q2) {
        if (q1.measurementType !== q2.measurementType) throw new Error('Cannot divide different measurement categories');
        if (q2.value === 0 || this.convertToBase(q2.value, q2.unit, q2.measurementType) === 0) {
            throw new Error('Divide by zero');
        }

        const baseVal1 = this.convertToBase(q1.value, q1.unit, q1.measurementType);
        const baseVal2 = this.convertToBase(q2.value, q2.unit, q2.measurementType);
        const result =  baseVal1 / baseVal2; 
        return Number(result.toFixed(4)); // Round to 4 decimal places
    }
}

module.exports = new QuantityService();