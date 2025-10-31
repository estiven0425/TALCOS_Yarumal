const Paros = require("../models/Paros");

exports.leerParo = async (req, res) => {
  try {
    const paros = await Paros.findAll({
      where: { actividad_paro: true },
    });

    res.json(paros);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearParo = async (req, res) => {
  const { nombre_paro } = req.body;

  try {
    const nuevoParo = await Paros.create({
      nombre_paro,
    });

    res.status(201).json(nuevoParo);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el tipo de paro" + error });
  }
};

exports.actualizarParo = async (req, res) => {
  const { id_paro, nombre_paro, actividad_paro } = req.body;

  try {
    const paro = await Paros.findByPk(id_paro);

    if (paro) {
      await paro.update({
        nombre_paro,
        actividad_paro,
      });

      res.json(paro);
    } else {
      res.status(404).json({ error: "Tipo de paro no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el tipo de paro" + error });
  }
};

exports.eliminarParo = async (req, res) => {
  const { id_paro, actividad_paro } = req.body;

  try {
    const paro = await Paros.findByPk(id_paro);

    if (paro) {
      await paro.update({
        actividad_paro,
      });

      res.json(paro);
    } else {
      res.status(404).json({ error: "Tipo de paro no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el tipo de paro" + error });
  }
};
