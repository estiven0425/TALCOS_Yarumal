const createError = require('http-errors');

// Manejador de errores 404
const notFoundHandler = (req, res, next) => {
    next(createError(404));
};

// Manejador de errores globales
const globalErrorHandler = (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
};

module.exports = {
    notFoundHandler,
    globalErrorHandler
};