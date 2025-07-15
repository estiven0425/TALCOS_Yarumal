function onError(port) {
  // Función para manejar errores del servidor
  return function (error) {
    // Retorna una función que procesa el error
    if (error.syscall !== "listen") {
      // Si el error no es de escucha
      throw error; // Lanza el error
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port; // Define el tipo de binding (pipe o puerto)
    switch (
      error.code // Evalúa el código de error
    ) {
      case "EACCES": // Error de permisos
        console.error(bind + " requiere permisos elevados"); // Mensaje para error de permisos insuficientes
        process.exit(1); // Termina el proceso con error
        break;
      case "EADDRINUSE": // Error de puerto en uso
        console.error(bind + " ya está en uso"); // Mensaje para puerto ocupado
        process.exit(1); // Termina el proceso con error
        break;
      default:
        throw error; // Lanza cualquier otro tipo de error
    }
  };
}

module.exports = onError; // Exporta la función de manejo de errores
