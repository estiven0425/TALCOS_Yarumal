const { Op } = require("sequelize");
const Novedad = require("../models/Novedad");
const Usuarios = require("../models/Usuarios");

exports.leerNovedad = async (req, res) => {
  try {
    const novedades = await Novedad.findAll({
      include: [
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
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
        },
      ],
      where: { actividad_novedad: true },
    });

    res.json(novedades);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.turnoNovedad = async (req, res) => {
  const { fecha, turno } = req.query;

  let fechaConsulta = new Date(fecha);

  const fechaFormateada = fechaConsulta.toISOString().split("T")[0];

  try {
    const novedades = await Novedad.findAll({
      include: [
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
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
        },
      ],
      where: {
        [Op.and]: [
          { fecha_novedad: fechaFormateada },
          { turno_novedad: turno },
          { actividad_novedad: true },
        ],
      },
      order: [["hora_novedad", "DESC"]],
    });

    res.json(novedades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener novedades" + error });
  }
};

exports.listaNovedad = async (req, res) => {
  const { fecha, turno, inicioTurno, finTurno } = req.query;

  let fechaConsulta = new Date(fecha);

  const [horaInicio] = inicioTurno.split(":").map(Number);
  const [horaFin] = finTurno.split(":").map(Number);

  if (horaFin < horaInicio) {
    fechaConsulta.setDate(fechaConsulta.getDate() - 1);
  }

  const fechaFormateada = fechaConsulta.toISOString().split("T")[0];

  try {
    const novedades = await Novedad.findAll({
      include: [
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
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
        },
      ],
      where: {
        [Op.and]: [
          { fecha_novedad: fechaFormateada },
          { turno_novedad: turno },
          { tipo_novedad: "Paro" },
          { actividad_novedad: true },
        ],
      },
      order: [["hora_novedad", "DESC"]],
    });

    res.json(novedades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener novedades" + error });
  }
};

exports.listaParoNovedad = async (req, res) => {
  const { fecha, turno } = req.query;

  let fechaConsulta = new Date(fecha);

  const fechaFormateada = fechaConsulta.toISOString().split("T")[0];

  try {
    const novedades = await Novedad.findAll({
      include: [
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
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
        },
      ],
      where: {
        [Op.and]: [
          { fecha_novedad: fechaFormateada },
          { turno_novedad: turno },
          { tipo_novedad: "Paro" },
          { fin_paro_novedad: null },
          { actividad_novedad: true },
        ],
      },
      order: [["hora_novedad", "DESC"]],
    });

    res.json(novedades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener novedades" + error });
  }
};

exports.crearNovedad = async (req, res) => {
  const novedad = req.body;

  try {
    const nuevaNovedad = await Novedad.bulkCreate(novedad);

    res.status(201).json(nuevaNovedad);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la novedad" + error });
  }
};

exports.actualizarNovedad = async (req, res) => {
  const novedad = req.body;

  try {
    const updatePromises = novedad.map(async (novedad) => {
      const novedadExistente = await Novedad.findByPk(novedad.id_novedad);

      if (novedadExistente) {
        await novedadExistente.update({
          fecha_novedad: novedad.fecha_novedad,
          hora_novedad: novedad.hora_novedad,
          turno_novedad: novedad.turno_novedad,
          tipo_novedad: novedad.tipo_novedad,
          molino_novedad: novedad.molino_novedad,
          referencia_novedad: novedad.referencia_novedad,
          bulto_novedad: novedad.bulto_novedad,
          operador_novedad: novedad.operador_novedad,
          bob_cat: novedad.bob_cat,
          carguero_novedad: novedad.carguero_novedad,
          mecanico_novedad: novedad.mecanico_novedad,
          inicio_paro_novedad: novedad.inicio_paro_novedad,
          fin_paro_novedad: novedad.fin_paro_novedad,
          horometro_inicio_paro_novedad: novedad.horometro_inicio_paro_novedad,
          horometro_fin_paro_novedad: novedad.horometro_fin_paro_novedad,
          motivo_paro_novedad: novedad.motivo_paro_novedad,
          observacion_novedad: novedad.observacion_novedad,
          actividad_novedad: novedad.actividad_novedad,
        });
        return novedadExistente;
      } else {
        throw new Error(`Novedad con id ${novedad.id_novedad} no encontrada`);
      }
    });

    const resultados = await Promise.all(updatePromises);
    res.json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar las novedades" + error });
  }
};

exports.finParoNovedad = async (req, res) => {
  const { id_novedad, fin_paro_novedad, horometro_fin_paro_novedad } = req.body;

  try {
    const novedad = await Novedad.findByPk(id_novedad);

    if (novedad) {
      await novedad.update({
        fin_paro_novedad,
        horometro_fin_paro_novedad,
      });

      res.json(novedad);
    } else {
      res.status(404).json({ error: "Paro no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al finalizar el paro" + error });
  }
};
