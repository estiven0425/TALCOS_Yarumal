const Referencias = require("../models/Referencias");

exports.leerReferencia = async (req, res) => {
  try {
    const referencias = await Referencias.findAll({
      where: { actividad_referencia: true },
    });

    res.json(referencias);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearReferencia = async (req, res) => {
  const { nombre_referencia, cantidad_referencia, cliente_referencia } =
    req.body;

  try {
    const nuevaReferencia = await Referencias.create({
      nombre_referencia,
      cantidad_referencia,
      cliente_referencia,
    });

    res.status(201).json(nuevaReferencia);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la referencia" });
  }
};

exports.actualizarReferencia = async (req, res) => {
  const {
    id_referencia,
    nombre_referencia,
    cantidad_referencia,
    cliente_referencia,
    actividad_referencia,
  } = req.body;

  try {
    const referencia = await Referencias.findByPk(id_referencia);

    if (referencia) {
      await referencia.update({
        nombre_referencia,
        cantidad_referencia,
        cliente_referencia,
        actividad_referencia,
      });

      res.json(referencia);
    } else {
      res.status(404).json({ error: "Referencia no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la referencia" });
  }
};

exports.eliminarReferencia = async (req, res) => {
  const { id_referencia, actividad_referencia } = req.body;

  try {
    const referencia = await Referencias.findByPk(id_referencia);

    if (referencia) {
      await referencia.update({
        actividad_referencia,
      });

      res.json(referencia);
    } else {
      res.status(404).json({ error: "Referencia no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la referencia" });
  }
};
