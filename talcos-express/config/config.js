#!/usr/bin/env node

// Importación de dependencias
const app = require('../app');
const http = require('http');
const normalizePort = require('./normalizePort');
const onError = require('./onError');
const onListening = require('./onListening');

// Importación de base de datos
const { conectionDataBase } = require('./conectionDataBase');

// Conexión a la base de datos
conectionDataBase();

// Obtener el puerto, configurarlo y almacenarlo en Express
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// Crear servidor HTTP
const server = http.createServer(app);

// Escuchar en el puerto y en las demás interfaces 
server.listen(port, '0.0.0.0', () => console.log(`Servidor iniciado en el puerto: ${port}`));
server.on('error', onError(port));
server.on('listening', onListening(server));