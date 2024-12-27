const express = require('express');
const app = express();

// Importar middlewares
const logger = require('./middlewares/logger');
const jsonParser = require('./middlewares/jsonParser');
const urlencodedParser = require('./middlewares/urlencodedParser');
const cookieParser = require('./middlewares/cookieParser');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

// Usar middlewares
app.use(logger);
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser);
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
