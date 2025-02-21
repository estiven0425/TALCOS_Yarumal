function onError(port) {
  return function (error) {
    if (error.syscall !== "listen") {
      throw error;
    }

    const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requiere permisos elevados");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " ya está en uso");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
}

module.exports = onError;
