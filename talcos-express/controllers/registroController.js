const Registros = require("../models/Registros");
const Usuarios = require("../models/Usuarios");
const MateriasPrimas = require("../models/MateriasPrimas");

exports.leerRegistro = async (req, res) => {
  try {
    const registros = await Registros.findAll({
      include: [
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "titular",
          foreignKey: "titular_registro",
        },
      ],
      where: { actividad_registro: true },
    });

    res.json(registros);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearRegistro = async (req, res) => {
  const { fullRecord } = req.body;

  try {
    const nuevoRegistro = await Registros.create(fullRecord);
    const materiaPrima = await MateriasPrimas.findOne({
      where: { nombre_materia_prima: fullRecord.mp_registro },
    });

    if (materiaPrima) {
      const nuevaCantidad =
        parseFloat(materiaPrima.cantidad_materia_prima) +
        parseFloat(fullRecord.peso_mp_registro);

      await materiaPrima.update({ cantidad_materia_prima: nuevaCantidad });
    }

    res.status(201).json(nuevoRegistro);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el registro" });
  }
};

exports.importarRegistro = async (req, res) => {
  const fullRecord = req.body;

  try {
    const nuevosRegistros = await Registros.bulkCreate(fullRecord);

    for (const record of fullRecord) {
      const materiaPrima = await MateriasPrimas.findOne({
        where: { nombre_materia_prima: record.mp_registro },
      });

      if (materiaPrima) {
        const nuevaCantidad =
          parseFloat(materiaPrima.cantidad_materia_prima) +
          parseFloat(record.peso_mp_registro);

        await materiaPrima.update({ cantidad_materia_prima: nuevaCantidad });
      }
    }

    res.status(201).json(nuevosRegistros);
  } catch (error) {
    res.status(500).json({ error: "Error al crear los registros" });
  }
};

exports.actualizarRegistro = async (req, res) => {
  const {
    id_registro,
    fecha_registro,
    hora_registro,
    mes_registro,
    titular_registro,
    remision_registro,
    nombre_proveedor_registro,
    documento_proveedor_registro,
    nombre_transportador_registro,
    documento_transportador_registro,
    tipo_registro,
    mp_registro,
    valor_mp_registro,
    peso_mp_registro,
    concepto_registro,
    zona_registro,
    bonificacion_registro,
    valor_t_registro,
    observacion_registro,
    actividad_registro,
  } = req.body;

  try {
    const registro = await Registros.findByPk(id_registro);

    if (registro) {
      await registro.update({
        fecha_registro,
        hora_registro,
        mes_registro,
        titular_registro,
        remision_registro,
        nombre_proveedor_registro,
        documento_proveedor_registro,
        nombre_transportador_registro,
        documento_transportador_registro,
        tipo_registro,
        mp_registro,
        valor_mp_registro,
        peso_mp_registro,
        concepto_registro,
        zona_registro,
        bonificacion_registro,
        valor_t_registro,
        observacion_registro,
        actividad_registro,
      });

      res.json(registro);
    } else {
      res.status(404).json({ error: "Registro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el registro" });
  }
};

exports.eliminarRegistros = async (req, res) => {
  const { ids_registros } = req.body;

  try {
    await Registros.update(
      { actividad_registro: false },
      { where: { id_registro: ids_registros } }
    );

    res.status(200).json({ message: "Registros eliminados correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar los registros" });
  }
};
