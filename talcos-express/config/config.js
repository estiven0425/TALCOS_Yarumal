#!/usr/bin/env node

// Importaci�n de dependencias
const app = require('../app');
const http = require('http');
const normalizePort = require('./normalizePort');
const onError = require('./onError');
const onListening = require('./onListening');

// Obtener el puerto, configurarlo y almacenarlo en Express
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

// Crear servidor HTTP
const server = http.createServer(app);

// Escuchar en el puerto y en las dem�s interfaces 
server.listen(port);
server.on('error', onError(port));
server.on('listening', onListening(server));
