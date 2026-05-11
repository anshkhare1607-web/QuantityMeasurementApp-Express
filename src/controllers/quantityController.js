const quantityService = require('../services/quantityService');
const QuantityMeasurement = require('../models/QuantityMeasurement');

// Helper to log operations in DB
const logOperation = async (req, params) => {
    try {
        await QuantityMeasurement.create({
            ...params,
            UserId: req.user ? req.user.id : null // Assuming User association
        });
    } catch (err) {
        console.error("Failed to log operation", err);
    }
};

const executeOperation = async (req, res, next, operationName, logicCallback) => {
    const { thisQuantityDTO, thatQuantityDTO, targetQuantityDTO } = req.body;
    let resultValue = null;
    let resultString = null;
    let isError = false;
    let errorMessage = null;
    let resultUnit = null;
    if (operationName === 'DIVIDE' || operationName === 'COMPARE') {
        resultUnit = null;
    } else {
        resultUnit = targetQuantityDTO ? targetQuantityDTO.unit : thisQuantityDTO.unit;
    }
    try {
        const result = logicCallback();

        if (typeof result === 'boolean') {
            resultString = result.toString();
        } else {
            resultValue = result;
        }

        await logOperation(req, {
            thisValue: thisQuantityDTO.value,
            thisUnit: thisQuantityDTO.unit,
            thisMeasurementType: thisQuantityDTO.measurementType,
            thatValue: thatQuantityDTO ? thatQuantityDTO.value : null,
            thatUnit: thatQuantityDTO ? thatQuantityDTO.unit : null,
            thatMeasurementType: thatQuantityDTO ? thatQuantityDTO.measurementType : null,
            operation: operationName,
            resultString,
            resultValue,
            resultUnit,
            resultMeasurementType: thisQuantityDTO.measurementType,
            isError: false
        });

        res.status(200).json({
            thisValue: thisQuantityDTO.value,
            thisUnit: thisQuantityDTO.unit,
            thisMeasurementType: thisQuantityDTO.measurementType,
            thatValue: thatQuantityDTO ? thatQuantityDTO.value : null,
            thatUnit: thatQuantityDTO ? thatQuantityDTO.unit : null,
            operation: operationName,
            resultString,
            resultValue,
            resultUnit,
            isError: false
        });

    } catch (error) {
        await logOperation(req, {
            thisValue: thisQuantityDTO.value,
            thisUnit: thisQuantityDTO.unit,
            thisMeasurementType: thisQuantityDTO.measurementType,
            thatValue: thatQuantityDTO ? thatQuantityDTO.value : null,
            thatUnit: thatQuantityDTO ? thatQuantityDTO.unit : null,
            thatMeasurementType: thatQuantityDTO ? thatQuantityDTO.measurementType : null,
            operation: operationName,
            isError: true,
            errorMessage: error.message
        });
        error.status = 400; // Client bad request mapping
        next(error);
    }
};

exports.compare = (req, res, next) => {
    executeOperation(req, res, next, 'COMPARE', () => {
        return quantityService.compare(req.body.thisQuantityDTO, req.body.thatQuantityDTO);
    });
};

exports.convert = (req, res, next) => {
    executeOperation(req, res, next, 'CONVERT', () => {
        return quantityService.convert(req.body.thisQuantityDTO, req.body.thatQuantityDTO.unit);
    });
};

exports.add = (req, res, next) => {
    executeOperation(req, res, next, 'ADD', () => {
        return quantityService.add(req.body.thisQuantityDTO, req.body.thatQuantityDTO);
    });
};

exports.addWithTarget = (req, res, next) => {
    executeOperation(req, res, next, 'ADD', () => {
        return quantityService.add(req.body.thisQuantityDTO, req.body.thatQuantityDTO, req.body.targetQuantityDTO.unit);
    });
};

exports.subtract = (req, res, next) => {
    executeOperation(req, res, next, 'SUBTRACT', () => {
        return quantityService.subtract(req.body.thisQuantityDTO, req.body.thatQuantityDTO);
    });
};

exports.subtractWithTarget = (req, res, next) => {
    executeOperation(req, res, next, 'SUBTRACT', () => {
        return quantityService.subtract(req.body.thisQuantityDTO, req.body.thatQuantityDTO, req.body.targetQuantityDTO.unit);
    });
};

exports.divide = (req, res, next) => {
    executeOperation(req, res, next, 'DIVIDE', () => {
        return quantityService.divide(req.body.thisQuantityDTO, req.body.thatQuantityDTO);
    });
};

// History Endpoints
exports.getHistoryByOperation = async (req, res, next) => {
    try {
        const history = await QuantityMeasurement.findAll({ where: { operation: req.params.operation.toUpperCase() } });
        res.json(history);
    } catch (err) { next(err); }
};

exports.getHistoryByType = async (req, res, next) => {
    try {
        const history = await QuantityMeasurement.findAll({ where: { thisMeasurementType: req.params.type } });
        res.json(history);
    } catch (err) { next(err); }
};

exports.getCountByOperation = async (req, res, next) => {
    try {
        const count = await QuantityMeasurement.count({ where: { operation: req.params.operation.toUpperCase() } });
        res.json({ count });
    } catch (err) { next(err); }
};

exports.getErroredHistory = async (req, res, next) => {
    try {
        const errors = await QuantityMeasurement.findAll({ where: { isError: true } });
        res.json(errors);
    } catch (err) { next(err); }
};