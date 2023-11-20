import constants from '../constants/httpStatus.js';

const errorHandler = (err, req, res, next) => {
    const statusCode =
        res.statusCode || err.statusCode || constants.SERVER_ERROR;
    const message = err.message || 'Server Error';
    res.status(statusCode).json({
        statusCode,
        message
    });
};

export default errorHandler;
