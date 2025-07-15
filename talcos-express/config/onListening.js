const debug = require("debug")("talcos-express:server"); // Importa el módulo debug para mensajes de depuración

function onListening(server) {
  // Función que maneja el evento de escucha del servidor
  return function () {
    // Retorna una función callback
    const addr = server.address(); // Obtiene la dirección del servidor
    const bind =
      typeof addr === "string" ? "pipe " + addr : "port " + addr.port; // Formatea el tipo de conexión
    debug("Escuchando en: " + bind); // Muestra mensaje de depuración con el punto de escucha
  };
}

module.exports = onListening; // Exporta la función de manejo de escucha
