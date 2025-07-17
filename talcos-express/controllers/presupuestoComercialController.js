const PresupuestoComercial = require("../models/PresupuestoComercial");

exports.leerPresupuestoComercial = async (req, res) => {
  try {
    const presupuestosComerciales = await PresupuestoComercial.findAll({
      where: { actividad_presupuesto_comercial: true },
    });

    res.json(presupuestosComerciales);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearPresupuestoComercial = async (req, res) => {
  const { fecha_presupuesto_comercial, capacidad_presupuesto_comercial } =
    req.body;

  try {
    const nuevoPresupuestoComercial = await PresupuestoComercial.create({
      fecha_presupuesto_comercial,
      capacidad_presupuesto_comercial,
    });

    res.status(201).json(nuevoPresupuestoComercial);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el presupuesto comercial" + error });
  }
};

exports.actualizarPresupuestoComercial = async (req, res) => {
  const {
    id_presupuesto_comercial,
    fecha_presupuesto_comercial,
    capacidad_presupuesto_comercial,
    actividad_presupuesto_comercial,
  } = req.body;

  try {
    const presupuestoComercial = await PresupuestoComercial.findByPk(
      id_presupuesto_comercial,
    );

    if (presupuestoComercial) {
      await presupuestoComercial.update({
        fecha_presupuesto_comercial,
        capacidad_presupuesto_comercial,
        actividad_presupuesto_comercial,
      });

      res.json(presupuestoComercial);
    } else {
      res.status(404).json({ error: "Presupuesto comercial no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el presupuesto comercial" + error });
  }
};

exports.eliminarPresupuestoComercial = async (req, res) => {
  const { id_presupuesto_comercial, actividad_presupuesto_comercial } =
    req.body;

  try {
    const presupuestoComercial = await PresupuestoComercial.findByPk(
      id_presupuesto_comercial,
    );

    if (presupuestoComercial) {
      await presupuestoComercial.update({
        actividad_presupuesto_comercial,
      });

      res.json(presupuestoComercial);
    } else {
      res.status(404).json({ error: "Presupuesto comercial no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el presupuesto comercial" + error });
  }
};
