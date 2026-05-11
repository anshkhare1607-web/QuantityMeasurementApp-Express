// Base units for conversion: METER for Length, LITRE for Volume, GRAM for Weight
const MEASUREMENT_TYPES = {
    LengthUnit: {
        METER: 1.0,          // Base Unit
        KILOMETER: 1000.0,   
        CENTIMETERS: 0.01,   
        INCHES: 0.0254,      
        FEET: 0.3048,       
        YARDS: 0.9144        
    },
    VolumeUnit: {
        LITRE: 1.0,          // Base Unit
        GALLON: 3.785,
        MILLILITER: 0.001
    },
    WeightUnit: {
        GRAM: 1.0,           // Base Unit
        MILLIGRAM: 0.001,
        KILOGRAM: 1000.0,
        POUND: 453.592,
        TONNE: 1000000.0
    },
    TemperatureUnit: {
        CELSIUS: 'CELSIUS',
        FAHRENHEIT: 'FAHRENHEIT'
    }
};

module.exports = { MEASUREMENT_TYPES };