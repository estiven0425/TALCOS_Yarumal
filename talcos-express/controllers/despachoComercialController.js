const { Op } = require("sequelize");

const DespachoComercial = require("../models/DespachoComercial");

exports.leerDespachoComercial = async (req, res) => {
  try {
    const despachosComerciales = await DespachoComercial.findAll({
      where: { actividad_despacho_comercial: true },
    });

    res.json(despachosComerciales);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.leerDespachosComercialesFiltrados = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    let whereClause = { actividad_despacho_comercial: true };

    if (inicio && fin) {
      whereClause.fecha_despacho_comercial = {
        [Op.between]: [inicio, fin],
      };
    }

    const despachosComerciales = await DespachoComercial.findAll({
      where: whereClause,
    });

    res.json(despachosComerciales);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearDespachoComercial = async (req, res) => {
  const { fecha_despacho_comercial, cantidad_despacho_comercial } = req.body;

  try {
    const nuevoDespachoComercial = await DespachoComercial.create({
      fecha_despacho_comercial,
      cantidad_despacho_comercial,
    });

    res.status(201).json(nuevoDespachoComercial);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el despacho programado" + error });
  }
};

exports.actualizarDespachoComercial = async (req, res) => {
  const {
    id_despacho_comercial,
    fecha_despacho_comercial,
    cantidad_despacho_comercial,
    actividad_despacho_comercial,
  } = req.body;

  try {
    const despachoComercial = await DespachoComercial.findByPk(
      id_despacho_comercial,
    );

    if (despachoComercial) {
      await despachoComercial.update({
        fecha_despacho_comercial,
        cantidad_despacho_comercial,
        actividad_despacho_comercial,
      });

      res.json(despachoComercial);
    } else {
      res.status(404).json({ error: "Despacho programado no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el despacho programado" + error });
  }
};

exports.eliminarDespachoComercial = async (req, res) => {
  const { id_despacho_comercial, actividad_despacho_comercial } = req.body;

  try {
    const despachoComercial = await DespachoComercial.findByPk(
      id_despacho_comercial,
    );

    if (despachoComercial) {
      await despachoComercial.update({
        actividad_despacho_comercial,
      });

      res.json(despachoComercial);
    } else {
      res.status(404).json({ error: "Despacho programado no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el despacho programado" + error });
  }
};
