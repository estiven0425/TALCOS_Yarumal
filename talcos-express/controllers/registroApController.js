const RegistrosAp = require("../models/RegistrosAp");
const Usuarios = require("../models/Usuarios");

exports.leerRegistroAp = async (req, res) => {
  try {
    const registrosAp = await RegistrosAp.findAll({
      include: [
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "titular",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "operador",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "carguero",
        },
      ],
      where: { actividad_registro_ap: true },
    });

    res.json(registrosAp);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error.message);
  }
};

exports.crearRegistroAp = async (req, res) => {
  const fullRecord = req.body;

  try {
    const nuevoRegistroAp = await RegistrosAp.bulkCreate(fullRecord);
    res.status(201).json(nuevoRegistroAp);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el registro AP: " + error.message });
  }
};

exports.actualizarRegistroAp = async (req, res) => {
  const {
    id_registro_ap,
    fecha_registro_ap,
    turno_registro_ap,
    mes_registro_ap,
    titular_registro_ap,
    operador_registro_ap,
    ingreso_roca_registro_ap,
    bobcat_roca_registro_ap,
    ingreso_grueso_registro_ap,
    bobcat_grueso_registro_ap,
    peso_bobcat_registro_ap,
    total_roca_registro_ap,
    total_grueso_registro_ap,
    molino_registro_ap,
    horometro_inicio_registro_ap,
    horometro_fin_registro_ap,
    carguero_registro_ap,
    observacion_registro_ap,
    actividad_registro_ap,
  } = req.body;

  try {
    const registroAp = await RegistrosAp.findByPk(id_registro_ap);

    if (registroAp) {
      await registroAp.update({
        fecha_registro_ap,
        turno_registro_ap,
        mes_registro_ap,
        titular_registro_ap,
        operador_registro_ap,
        ingreso_roca_registro_ap,
        bobcat_roca_registro_ap,
        ingreso_grueso_registro_ap,
        bobcat_grueso_registro_ap,
        peso_bobcat_registro_ap,
        total_roca_registro_ap,
        total_grueso_registro_ap,
        molino_registro_ap,
        horometro_inicio_registro_ap,
        horometro_fin_registro_ap,
        carguero_registro_ap,
        observacion_registro_ap,
        actividad_registro_ap,
      });

      res.json(registroAp);
    } else {
      res.status(404).json({ error: "Registro AP no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el registro AP: " + error.message });
  }
};

exports.eliminarRegistrosAp = async (req, res) => {
  const { ids_registros_ap } = req.body;

  try {
    await RegistrosAp.update(
      { actividad_registro_ap: false },
      { where: { id_registro_ap: ids_registros_ap } }
    );

    res.status(200).json({ message: "Registro AP eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el registro AP: " + error.message });
  }
};
