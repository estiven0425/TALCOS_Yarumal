const express = require('express');
const path = require('path');
const app = express();

// Establecer motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Importar middlewares
const cors = require('./middlewares/cors');
const logger = require('./middlewares/logger');
const jsonParser = require('./middlewares/jsonParser');
const urlencodedParser = require('./middlewares/urlencodedParser');
const cookieParser = require('./middlewares/cookieParser');
const { notFoundHandler, globalErrorHandler } = require('./middlewares/errorHandler');

// Importar rutas
const perfilesRoutes = require('./routes/perfilesRoutes');

// Usar middlewares
app.use(cors);
app.use(logger);
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser);

// Usar rutas
app.use('/perfiles', perfilesRoutes);

// Ruta de verificación
app.get('/verify', (req, res) => {
    res.render('verify', { message: 'Servidor funcionando correctamente' });
});

// Usar middlewares de errores
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
