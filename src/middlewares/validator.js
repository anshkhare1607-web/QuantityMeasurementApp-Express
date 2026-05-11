const { body, validationResult } = require('express-validator');

// Validation rules mimicking the Spring @Valid and DTO annotations
exports.validateQuantityInput = [
    body('thisQuantityDTO').isObject().withMessage('thisQuantityDTO is required'),
    body('thisQuantityDTO.value').isNumeric().withMessage('Value must be a number'),
    body('thisQuantityDTO.unit').notEmpty().withMessage('Unit cannot be empty'),
    body('thisQuantityDTO.measurementType').isIn(['LengthUnit', 'VolumeUnit', 'WeightUnit', 'TemperatureUnit'])
        .withMessage('Invalid Measurement Type'),

    // thatQuantityDTO is optional for some operations (like convert), but if present, validate it
    body('thatQuantityDTO').optional().isObject(),
    body('thatQuantityDTO.value').optional().isNumeric(),
    body('thatQuantityDTO.unit').optional().notEmpty(),

    // Middleware to catch errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                timestamp: new Date().toISOString(),
                status: 400,
                error: 'Bad Request',
                message: errors.array().map(e => e.msg).join(', '),
                path: req.originalUrl
            });
        }
        next();
    }
];