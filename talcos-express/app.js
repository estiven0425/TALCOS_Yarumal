const express = require('express');
const path = require('path');
const os = require('os');
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
const molinosRoutes = require('./routes/molinosRoutes');
const turnosRoutes = require('./routes/turnosRoutes');
const referenciasRoutes = require('./routes/referenciasRoutes');
const productosRechazadosRoutes = require('./routes/productosRechazadosRoutes');
const materiasPrimasRoutes = require('./routes/materiasPrimasRoutes');
const bobCatsRoutes = require('./routes/bobCatsRoutes');

// Usar middlewares
app.use(cors);
app.use(logger);
app.use(jsonParser);
app.use(urlencodedParser);
app.use(cookieParser);

// Usar rutas
app.use('/perfiles', perfilesRoutes);
app.use('/molinos', molinosRoutes);
app.use('/turnos', turnosRoutes);
app.use('/referencias', referenciasRoutes);
app.use('/productos_rechazados', productosRechazadosRoutes);
app.use('/materias_primas', materiasPrimasRoutes);
app.use('/bob_cats', bobCatsRoutes);

// Ruta de verificación
app.get('/verify', (req, res) => {
    const serverStatus = {
        message: 'Servidor funcionando correctamente',
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        loadAverage: os.loadavg(),
        freeMemory: os.freemem(),
        totalMemory: os.totalmem(),
        cpus: os.cpus().length
    }; res.render('verify', serverStatus);
});

// Usar middlewares de errores
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;