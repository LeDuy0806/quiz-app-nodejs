import constants from '../constants/httpStatus.js';

const errorHandler = (err, req, res, next) => {
    const statusCode =
        res.statusCode || err.statusCode || constants.SERVER_ERROR;
    const message = err.message || 'Server Error';
    const stackTrace = err.stack || null;

    res.status(statusCode).json({
        statusCode,
        message,
        stackTrace
    });
};

export default errorHandler;
