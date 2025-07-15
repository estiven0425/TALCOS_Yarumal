const DespachoComercial = require("../models/DespachoComercial"); // Importa el modelo de Despacho Comercial
const { Op } = require("sequelize"); // Importa operadores de Sequelize

exports.leerDespachoComercial = async (req, res) => {
  // Controlador para obtener todos los despachos comerciales activos
  try {
    const despachosComerciales = await DespachoComercial.findAll({
      // Busca todos los registros activos
      where: { actividad_despacho_comercial: true },
    });

    res.json(despachosComerciales); // Envía la respuesta con los despachos encontrados
  } catch (error) {
    res.status(500).send("Error del servidor: " + error); // Maneja errores del servidor
  }
};

exports.leerDespachosComercialesFiltrados = async (req, res) => {
  // Controlador para obtener despachos filtrados por fecha
  try {
    const { inicio, fin } = req.query; // Extrae fechas de inicio y fin de la consulta
    let whereClause = { actividad_despacho_comercial: true }; // Condición base para la búsqueda

    if (inicio && fin) {
      // Si se proporcionan ambas fechas
      whereClause.fecha_despacho_comercial = {
        // Agrega condición de rango de fechas
        [Op.between]: [inicio, fin],
      };
    }

    const despachosComerciales = await DespachoComercial.findAll({
      // Busca los despachos con los filtros
      where: whereClause,
    });

    res.json(despachosComerciales); // Envía la respuesta con los despachos filtrados
  } catch (error) {
    res.status(500).send("Error del servidor: " + error); // Maneja errores del servidor
  }
};

exports.crearDespachoComercial = async (req, res) => {
  // Controlador para crear un nuevo despacho comercial
  const { fecha_despacho_comercial, cantidad_despacho_comercial } = req.body; // Extrae datos del cuerpo

  try {
    const nuevoDespachoComercial = await DespachoComercial.create({
      // Crea un nuevo registro
      fecha_despacho_comercial,
      cantidad_despacho_comercial,
    });

    res.status(201).json(nuevoDespachoComercial); // Envía respuesta exitosa con el nuevo despacho
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el despacho programado" + error }); // Maneja errores de creación
  }
};

exports.actualizarDespachoComercial = async (req, res) => {
  // Controlador para actualizar un despacho comercial
  const {
    id_despacho_comercial,
    fecha_despacho_comercial,
    cantidad_despacho_comercial,
    actividad_despacho_comercial,
  } = req.body; // Extrae datos

  try {
    const despachoComercial = await DespachoComercial.findByPk(
      id_despacho_comercial,
    ); // Busca el despacho por ID

    if (despachoComercial) {
      // Si existe el despacho
      await despachoComercial.update({
        // Actualiza los campos
        fecha_despacho_comercial,
        cantidad_despacho_comercial,
        actividad_despacho_comercial,
      });

      res.json(despachoComercial); // Envía respuesta con el despacho actualizado
    } else {
      res.status(404).json({ error: "Despacho programado no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el despacho programado" + error }); // Maneja errores de actualización
  }
};

exports.eliminarDespachoComercial = async (req, res) => {
  // Controlador para eliminar (desactivar) un despacho
  const { id_despacho_comercial, actividad_despacho_comercial } = req.body; // Extrae ID y estado de actividad

  try {
    const despachoComercial = await DespachoComercial.findByPk(
      id_despacho_comercial,
    ); // Busca el despacho por ID

    if (despachoComercial) {
      // Si existe el despacho
      await despachoComercial.update({
        // Actualiza solo el estado de actividad
        actividad_despacho_comercial,
      });

      res.json(despachoComercial); // Envía respuesta con el despacho actualizado
    } else {
      res.status(404).json({ error: "Despacho programado no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el despacho programado" + error }); // Maneja errores de eliminación
  }
};
