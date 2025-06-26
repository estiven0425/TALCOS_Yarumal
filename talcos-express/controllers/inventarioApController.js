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
    res.status(500).json({ error: "Error al crear el inventario AP" });
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
    res.status(500).json({ error: "Error al actualizar el inventario AP" });
  }
};

exports.actualizarCantidadesInventarioAp = async (req, res) => {
  const actualizaciones = req.body;

  try {
    const resultados = await Promise.all(
      actualizaciones.map(async (actualizacion) => {
        const { id_inventario_ap, total_inventario_ap } = actualizacion;
        const inventarioApExistente = await InventarioAp.findByPk(
          id_inventario_ap
        );

        if (inventarioApExistente) {
          const cantidadActual =
            parseFloat(inventarioApExistente.total_inventario_ap) || 0;
          const cantidadNueva = parseFloat(total_inventario_ap) || 0;

          inventarioApExistente.total_inventario_ap =
            cantidadActual + cantidadNueva;

          await inventarioApExistente.save();

          return {
            id_inventario_ap,
            mensaje: "Cantidad de inventario AP actualizada con éxito",
            nueva_cantidad: inventarioApExistente.total_inventario_ap,
          };
        } else {
          return { id_inventario_ap, error: "Inventario AP no encontrado" };
        }
      })
    );

    const errores = resultados.filter((resultado) => resultado.error);
    if (errores.length > 0) {
      return res.status(404).json({ errores });
    }

    res.json({
      mensaje: "Cantidades de inventario AP actualizadas con éxito",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar las cantidades de el inventario AP",
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
    res.status(500).json({ error: "Error al eliminar el inventario AP" });
  }
};
