#!/usr/bin/env node

const app = require("../app");
const http = require("http");
const normalizePort = require("./normalizePort");
const onError = require("./onError");
const onListening = require("./onListening");
const { conectionDataBase } = require("./conectionDataBase");

conectionDataBase()
  .then(() => console.log("Conexión exitosa a la base de datos"))
  .catch((error) =>
    console.error("Error al conectar con la base de datos:", error),
  );

const port = normalizePort(process.env.PORT || 3000);

app.set("port", port);

const server = http.createServer(app);

server.listen(port, "0.0.0.0", () =>
  console.log(`Servidor iniciado en el puerto: ${port}`),
);

server.on("error", onError(port));
server.on("listening", onListening(server));
