const Despachos = require("../models/Despachos");

exports.leerDespachos = async (req, res) => {
  try {
    const despachos = await Despachos.findAll({
      where: { actividad_despachos: true },
    });

    res.json(despachos);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearDespacho = async (req, res) => {
  const { fecha_despachos, cantidad_despachos } = req.body;

  try {
    const nuevoDespacho = await Despachos.create({
      fecha_despachos,
      cantidad_despachos,
    });

    res.status(201).json(nuevoDespacho);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el despacho" });
  }
};

exports.actualizarDespacho = async (req, res) => {
  const {
    id_despachos,
    fecha_despachos,
    cantidad_despachos,
    actividad_despachos,
  } = req.body;

  try {
    const despacho = await Despachos.findByPk(id_despachos);

    if (despacho) {
      await despacho.update({
        fecha_despachos,
        cantidad_despachos,
        actividad_despachos,
      });

      res.json(despacho);
    } else {
      res.status(404).json({ error: "Despacho no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el despacho" });
  }
};

exports.eliminarDespacho = async (req, res) => {
  const { id_despachos, actividad_despachos } = req.body;

  try {
    const despacho = await Despachos.findByPk(id_despachos);

    if (despacho) {
      await despacho.update({
        actividad_despachos,
      });

      res.json(despacho);
    } else {
      res.status(404).json({ error: "Despacho no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el despacho" });
  }
};
