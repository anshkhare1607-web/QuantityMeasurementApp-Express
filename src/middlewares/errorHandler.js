const errorHandler = (err, req, res, next) => {
    console.error(`[Error]: ${err.message}`);

    const status = err.status || 500;
    const response = {
        timestamp: new Date().toISOString(),
        status: status,
        error: status === 400 ? 'Quantity Measurement Error' : 'Internal Server Error',
        message: err.message || 'Something went wrong',
        path: req.originalUrl
    };

    res.status(status).json(response);
};

module.exports = errorHandler;