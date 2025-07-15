#!/usr/bin/env node // Indica que este archivo debe ejecutarse con Node.js

const app = require("../app"); // Importa la aplicación Express principal
const http = require("http"); // Importa el módulo HTTP de Node.js
const normalizePort = require("./normalizePort"); // Importa función para normalizar el puerto
const onError = require("./onError"); // Importa manejador de errores del servidor
const onListening = require("./onListening"); // Importa manejador de eventos de escucha
const { conectionDataBase } = require("./conectionDataBase"); // Importa función de conexión a la base de datos

conectionDataBase() // Intenta conectar a la base de datos
  .then(() => console.log("Conexión exitosa a la base de datos"))
  .catch((error) =>
    console.error("Error al conectar con la base de datos:", error),
  );

const port = normalizePort(process.env.PORT || 3000); // Normaliza el puerto desde variables de entorno o usa 3000

app.set("port", port); // Configura el puerto en la aplicación Express

const server = http.createServer(app); // Crea el servidor HTTP con la aplicación Express

server.listen(port, "0.0.0.0", () =>
  // Inicia el servidor en todas las interfaces
  console.log(`Servidor iniciado en el puerto: ${port}`),
);

server.on("error", onError(port)); // Maneja eventos de error del servidor
server.on("listening", onListening(server)); // Maneja eventos de inicio de escucha
