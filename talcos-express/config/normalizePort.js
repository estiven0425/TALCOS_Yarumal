function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Llamado pipe
  }
  if (port >= 0) {
    return port; // Puerto en número
  }
  return false;
}

module.exports = normalizePort;
