function normalizePort(val) {
  const port = parseInt(val, 10); // Convierte el valor de entrada a número entero base 10

  if (isNaN(port)) {
    // Si no es un número válido
    return val; // Devuelve el valor original
  }
  if (port >= 0) {
    // Si el puerto es un número positivo
    return port; // Devuelve el puerto normalizado
  }

  return false; // Retorna falso si el puerto es negativo
}
module.exports = normalizePort; // Exporta la función de normalización de puerto
