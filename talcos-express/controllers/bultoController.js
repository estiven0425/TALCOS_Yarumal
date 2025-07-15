const Bultos = require("../models/Bultos"); // Importa el modelo de Bultos

exports.leerBulto = async (req, res) => {
  // Controlador para obtener todos los bultos activos
  try {
    const bultos = await Bultos.findAll({
      // Busca todos los bultos con estado activo
      where: { actividad_bulto: true },
    });

    res.json(bultos); // Envía la respuesta con los bultos encontrados
  } catch (error) {
    res.status(500).send("Error del servidor: " + error); // Maneja errores del servidor
  }
};

exports.crearBulto = async (req, res) => {
  // Controlador para crear un nuevo bulto
  const { nombre_bulto, capacidad_bulto } = req.body; // Extrae nombre y capacidad del cuerpo

  try {
    const nuevoBulto = await Bultos.create({
      // Crea un nuevo registro de bulto
      nombre_bulto,
      capacidad_bulto,
    });

    res.status(201).json(nuevoBulto); // Envía respuesta exitosa con el nuevo bulto
  } catch (error) {
    res.status(500).json({ error: "Error al crear el bulto" + error }); // Maneja errores de creación
  }
};

exports.actualizarBulto = async (req, res) => {
  // Controlador para actualizar un bulto
  const { id_bulto, nombre_bulto, capacidad_bulto, actividad_bulto } = req.body; // Extrae datos del cuerpo

  try {
    const bulto = await Bultos.findByPk(id_bulto); // Busca el bulto por su ID

    if (bulto) {
      // Si existe el bulto
      await bulto.update({
        // Actualiza los campos del bulto
        nombre_bulto,
        capacidad_bulto,
        actividad_bulto,
      });

      res.json(bulto); // Envía respuesta con el bulto actualizado
    } else {
      res.status(404).json({ error: "Bulto no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el bulto" + error }); // Maneja errores de actualización
  }
};

exports.eliminarBulto = async (req, res) => {
  // Controlador para eliminar (desactivar) un bulto
  const { id_bulto, actividad_bulto } = req.body; // Extrae ID y estado de actividad

  try {
    const bulto = await Bultos.findByPk(id_bulto); // Busca el bulto por su ID

    if (bulto) {
      // Si existe el bulto
      await bulto.update({
        // Actualiza solo el estado de actividad
        actividad_bulto,
      });

      res.json(bulto); // Envía respuesta con el bulto actualizado
    } else {
      res.status(404).json({ error: "Bulto no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el bulto" + error }); // Maneja errores de eliminación
  }
};
