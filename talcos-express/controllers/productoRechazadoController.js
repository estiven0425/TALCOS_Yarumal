const ProductosRechazados = require("../models/productosRechazados");

exports.leerProductoRechazado = async (req, res) => {
  try {
    const productosRechazados = await ProductosRechazados.findAll({
      where: { actividad_producto_rechazado: true },
    });

    res.json(productosRechazados);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearProductoRechazado = async (req, res) => {
  const {
    nombre_producto_rechazado,
    cantidad_producto_rechazado,
    retencion_producto_rechazado,
  } = req.body;

  try {
    const nuevoProductoRechazado = await ProductosRechazados.create({
      nombre_producto_rechazado,
      cantidad_producto_rechazado,
      retencion_producto_rechazado,
    });

    res.status(201).json(nuevoProductoRechazado);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el producto rechazado" });
  }
};

exports.actualizarProductoRechazado = async (req, res) => {
  const {
    id_producto_rechazado,
    nombre_producto_rechazado,
    cantidad_producto_rechazado,
    retencion_producto_rechazado,
    actividad_producto_rechazado,
  } = req.body;

  try {
    const productoRechazado = await ProductosRechazados.findByPk(
      id_producto_rechazado
    );

    if (productoRechazado) {
      await productoRechazado.update({
        nombre_producto_rechazado,
        cantidad_producto_rechazado,
        retencion_producto_rechazado,
        actividad_producto_rechazado,
      });

      res.json(productoRechazado);
    } else {
      res.status(404).json({ error: "Producto rechazado no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el producto rechazado" });
  }
};

exports.eliminarProductoRechazado = async (req, res) => {
  const { id_producto_rechazado, actividad_producto_rechazado } = req.body;

  try {
    const productoRechazado = await ProductosRechazados.findByPk(
      id_producto_rechazado
    );

    if (productoRechazado) {
      await productoRechazado.update({
        actividad_producto_rechazado,
      });

      res.json(productoRechazado);
    } else {
      res.status(404).json({ error: "Producto rechazado no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto rechazado" });
  }
};
