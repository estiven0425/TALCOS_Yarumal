const InventarioAp = require("../models/InventarioAp");

exports.leerInventarioAp = async (req, res) => {
  try {
    const inventarioAp = await InventarioAp.findAll({
      where: { actividad_inventario_ap: true },
    });

    res.json(inventarioAp);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearInventarioAp = async (req, res) => {
  const {
    tipo_inventario_ap,
    nombre_inventario_ap,
    porcentaje_inventario_ap,
    total_inventario_ap,
  } = req.body;

  try {
    const nuevoInventarioAp = await InventarioAp.create({
      tipo_inventario_ap,
      nombre_inventario_ap,
      porcentaje_inventario_ap,
      total_inventario_ap,
    });

    res.status(201).json(nuevoInventarioAp);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el inventario AP" + error });
  }
};

exports.actualizarInventarioAp = async (req, res) => {
  const {
    id_inventario_ap,
    tipo_inventario_ap,
    nombre_inventario_ap,
    porcentaje_inventario_ap,
    total_inventario_ap,
    actividad_inventario_ap,
  } = req.body;

  try {
    const inventarioAp = await InventarioAp.findByPk(id_inventario_ap);

    if (inventarioAp) {
      await inventarioAp.update({
        tipo_inventario_ap,
        nombre_inventario_ap,
        porcentaje_inventario_ap,
        total_inventario_ap,
        actividad_inventario_ap,
      });

      res.json(inventarioAp);
    } else {
      res.status(404).json({ error: "Inventario AP no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el inventario AP" + error });
  }
};

exports.actualizarCantidadesInventarioAp = async (req, res) => {
  const { total_inventario_ap } = req.body;

  try {
    if (isNaN(total_inventario_ap)) {
      return res
        .status(400)
        .json({ error: "Valor inválido para total_inventario_ap" });
    }

    const cantidadNueva = parseFloat(total_inventario_ap);
    const registros = await InventarioAp.findAll();

    if (!registros.length) {
      return res.json({
        mensaje: "No hay registros de inventario AP para actualizar",
        resultados: [],
      });
    }

    const resultados = [];

    for (const registro of registros) {
      const cantidadActual = parseFloat(registro.total_inventario_ap) || 0;

      registro.total_inventario_ap = cantidadActual + cantidadNueva;

      try {
        await registro.save();

        resultados.push({
          id_inventario_ap: registro.id_inventario_ap,
          mensaje: "Cantidad actualizada con éxito",
          nueva_cantidad: registro.total_inventario_ap,
        });
      } catch (errorInterno) {
        console.error(
          "Error actualizando registro:",
          registro.id_inventario_ap,
          errorInterno,
        );

        resultados.push({
          id_inventario_ap: registro.id_inventario_ap,
          mensaje: "Error al actualizar este registro",
          error: errorInterno.message,
        });
      }
    }

    res.json({
      mensaje: "Proceso de actualización completado",
      resultados,
    });
  } catch (error) {
    console.error("Error general:", error);
    res.status(500).json({
      error: "Error al actualizar las cantidades del inventario AP",
      details: error.message,
    });
  }
};

exports.eliminarInventarioAp = async (req, res) => {
  const { id_inventario_ap, actividad_inventario_ap } = req.body;

  try {
    const inventarioAp = await InventarioAp.findByPk(id_inventario_ap);

    if (inventarioAp) {
      await inventarioAp.update({
        actividad_inventario_ap,
      });

      res.json(inventarioAp);
    } else {
      res.status(404).json({ error: "Inventario AP no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el inventario AP" + error });
  }
};
