const { Sequelize } = require("sequelize"); // Importar Sequelize para la gestión de la base de datos
const sequelize = new Sequelize("talcos_yarumal", "TAYA", "TAYA-0000", {
  // Configuración de la conexión a la base de datos
  host: "localhost", // Host donde se encuentra la base de datos
  dialect: "mysql", // Tipo de base de datos a utilizar
});

const conectionDataBase = async () => {
  // Función asíncrona para establecer la conexión
  try {
    await sequelize.authenticate(); // Intento de autenticación con la base de datos

    console.log("MySQL conectado"); // Mensaje de éxito en la conexión
  } catch (error) {
    console.error("Imposible conectar a la base de datos. Error: ", error); // Mensaje de error si falla la conexión
  }
};

module.exports = { sequelize, conectionDataBase }; // Exportar la instancia de Sequelize y la función de conexión
