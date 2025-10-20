const { Op } = require("sequelize");
const Despachos = require("../models/Despachos");

exports.leerDespachos = async (req, res) => {
  try {
    const despachos = await Despachos.findAll({
      where: { actividad_despacho: true },
    });

    res.json(despachos);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.leerDespachosFiltrados = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    let whereClause = { actividad_despacho: true };

    if (inicio && fin) {
      whereClause.fecha_despacho = {
        [Op.between]: [inicio, fin],
      };
    }

    const despachos = await Despachos.findAll({
      where: whereClause,
    });

    res.json(despachos);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearDespacho = async (req, res) => {
  const { fecha_despacho, cantidad_despacho } = req.body;

  try {
    const nuevoDespacho = await Despachos.create({
      fecha_despacho,
      cantidad_despacho,
    });

    res.status(201).json(nuevoDespacho);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el despacho" + error });
  }
};

exports.actualizarDespacho = async (req, res) => {
  const { id_despacho, fecha_despacho, cantidad_despacho, actividad_despacho } =
    req.body;

  try {
    const despacho = await Despachos.findByPk(id_despacho);

    if (despacho) {
      await despacho.update({
        fecha_despacho,
        cantidad_despacho,
        actividad_despacho,
      });

      res.json(despacho);
    } else {
      res.status(404).json({ error: "Despacho no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el despacho" + error });
  }
};

exports.eliminarDespacho = async (req, res) => {
  const { id_despacho, actividad_despacho } = req.body;

  try {
    const despacho = await Despachos.findByPk(id_despacho);

    if (despacho) {
      await despacho.update({
        actividad_despacho,
      });

      res.json(despacho);
    } else {
      res.status(404).json({ error: "Despacho no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el despacho" + error });
  }
};
