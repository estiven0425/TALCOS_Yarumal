const BobCats = require("../models/BobCats"); // Importa el modelo de BobCats

exports.leerBobCat = async (req, res) => {
  // Controlador para obtener todos los BobCats activos
  try {
    const bobCats = await BobCats.findAll({
      // Busca todos los registros activos
      where: { actividad_bob_cat: true },
    });

    res.json(bobCats); // Envía la respuesta con los BobCats encontrados
  } catch (error) {
    res.status(500).send("Error del servidor: " + error); // Maneja errores del servidor
  }
};

exports.crearBobCat = async (req, res) => {
  // Controlador para crear un nuevo BobCat
  const { nombre_bob_cat } = req.body; // Extrae el nombre del cuerpo de la petición

  try {
    const nuevoBobCat = await BobCats.create({
      // Crea un nuevo registro
      nombre_bob_cat,
    });

    res.status(201).json(nuevoBobCat); // Envía respuesta exitosa con el nuevo BobCat
  } catch (error) {
    res.status(500).json({ error: "Error al crear el BobCat" + error }); // Maneja errores de creación
  }
};

exports.actualizarBobCat = async (req, res) => {
  // Controlador para actualizar un BobCat
  const { id_bob_cat, nombre_bob_cat, actividad_bob_cat } = req.body; // Extrae datos del cuerpo

  try {
    const bobCat = await BobCats.findByPk(id_bob_cat); // Busca el BobCat por ID

    if (bobCat) {
      // Si existe el BobCat
      await bobCat.update({
        // Actualiza los campos
        nombre_bob_cat,
        actividad_bob_cat,
      });

      res.json(bobCat); // Envía respuesta con el BobCat actualizado
    } else {
      res.status(404).json({ error: "BobCat no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el BobCat" + error }); // Maneja errores de actualización
  }
};

exports.eliminarBobCat = async (req, res) => {
  // Controlador para eliminar (desactivar) un BobCat
  const { id_bob_cat, actividad_bob_cat } = req.body; // Extrae ID y estado de actividad

  try {
    const bobCat = await BobCats.findByPk(id_bob_cat); // Busca el BobCat por ID

    if (bobCat) {
      // Si existe el BobCat
      await bobCat.update({
        // Actualiza solo el estado de actividad
        actividad_bob_cat,
      });

      res.json(bobCat); // Envía respuesta con el BobCat actualizado
    } else {
      res.status(404).json({ error: "Bob - cat no encontrado" }); // Maneja caso no encontrado
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el bob - cat" + error }); // Maneja errores de eliminación
  }
};
