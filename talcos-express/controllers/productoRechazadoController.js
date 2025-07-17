const ProductosRechazados = require("../models/productosRechazados");
const Referencias = require("../models/Referencias");

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
    // noinspection JSCheckFunctionSignatures
    const productoExistente = await ProductosRechazados.findOne({
      where: {
        nombre_producto_rechazado,
        retencion_producto_rechazado,
        actividad_producto_rechazado: true,
      },
    });

    let nuevoProductoRechazado;

    if (productoExistente) {
      const cantidadActual =
        parseFloat(productoExistente.cantidad_producto_rechazado) || 0;

      const cantidadNueva = parseFloat(cantidad_producto_rechazado) || 0;

      productoExistente.cantidad_producto_rechazado =
        cantidadActual + cantidadNueva;

      await productoExistente.save();

      nuevoProductoRechazado = productoExistente;
    } else {
      nuevoProductoRechazado = await ProductosRechazados.create({
        nombre_producto_rechazado,
        cantidad_producto_rechazado,
        retencion_producto_rechazado,
      });
    }

    res.status(201).json(nuevoProductoRechazado);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Error al crear o actualizar el producto rechazado" + error,
      });
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
      id_producto_rechazado,
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
      .json({ error: "Error al actualizar el producto rechazado" + error });
  }
};

exports.reasignarProductoRechazado = async (req, res) => {
  const {
    id_producto_rechazado,
    cantidad_producto_rechazado,
    referenciaSeleccionada,
  } = req.body;

  try {
    const productoRechazado = await ProductosRechazados.findByPk(
      id_producto_rechazado,
    );

    const referencia = await Referencias.findByPk(referenciaSeleccionada);

    if (productoRechazado && referencia) {
      const nuevaCantidadProductoRechazado =
        parseFloat(productoRechazado.cantidad_producto_rechazado) -
        parseFloat(cantidad_producto_rechazado);

      const nuevaCantidadReferencia =
        parseFloat(referencia.cantidad_referencia) +
        parseFloat(cantidad_producto_rechazado);

      await productoRechazado.update({
        cantidad_producto_rechazado: nuevaCantidadProductoRechazado,
      });

      await referencia.update({
        cantidad_referencia: nuevaCantidadReferencia,
      });

      res.json({ productoRechazado, referencia });
    } else {
      res
        .status(404)
        .json({ error: "Producto rechazado o referencia no encontrados" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el producto rechazado" + error });
  }
};

exports.eliminarProductoRechazado = async (req, res) => {
  const { id_producto_rechazado, actividad_producto_rechazado } = req.body;

  try {
    const productoRechazado = await ProductosRechazados.findByPk(
      id_producto_rechazado,
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
    res
      .status(500)
      .json({ error: "Error al eliminar el producto rechazado" + error });
  }
};
