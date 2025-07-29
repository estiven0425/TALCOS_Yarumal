const { Op } = require("sequelize");
const InformeInicial = require("../models/InformeInicial");
const InformeFinal = require("../models/InformeFinal");
const Turnos = require("../models/Turnos");
const Usuarios = require("../models/Usuarios");

exports.leerInformeInicial = async (req, res) => {
  try {
    const informesIniciales = await InformeInicial.findAll({
      include: [
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "titular",
          foreignKey: "titular_informe_inicial",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "operador",
          foreignKey: "operador_informe_inicial",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "carguero",
          foreignKey: "carguero_informe_inicial",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
          foreignKey: "mecanico_informe_inicial",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "cdc",
          foreignKey: "cdc_informe_inicial",
        },
      ],
      where: { actividad_informe_inicial: true },
    });

    res.json(informesIniciales);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.turnoInformeInicial = async (req, res) => {
  const { fecha, turno } = req.query;

  let fechaConsulta = new Date(fecha);

  fechaConsulta = fechaConsulta.toISOString().split("T")[0];

  try {
    const informes = await InformeInicial.findAll({
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
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "mecanico",
        },
        {
          model: Usuarios,
          attributes: ["nombre_usuario"],
          as: "cdc",
        },
      ],
      where: {
        [Op.and]: [
          { fecha_informe_inicial: fechaConsulta },
          { turno_informe_inicial: turno },
          { actividad_informe_inicial: true },
        ],
      },
      order: [["hora_informe_inicial", "DESC"]],
    });

    res.json(informes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener informe inicial" + error });
  }
};

exports.crearInformeInicial = async (req, res) => {
  const informe_inicial = req.body;

  try {
    const nuevoInforme = await InformeInicial.bulkCreate(informe_inicial);

    res.status(201).json(nuevoInforme);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el informe inicial" + error });
  }
};

exports.validarInformeFinalPendiente = async (req, res) => {
  try {
    const ultimoInformeInicial = await InformeInicial.findOne({
      order: [
        ["fecha_informe_inicial", "DESC"],
        ["hora_informe_inicial", "DESC"],
      ],
    });

    if (!ultimoInformeInicial) {
      return res.json({ pendiente: false });
    }

    const { fecha_informe_inicial, turno_informe_inicial } =
      ultimoInformeInicial;

    const ahora = new Date();

    let turnoActual = null;
    let fechaTurnoActual = null;
    let finTurnoInformeInicial = null;

    const turnos = await Turnos.findAll({
      where: { actividad_turno: true },
    });

    for (const turno of turnos) {
      const [inicioHora, inicioMinuto] = turno.inicio_turno
        .split(":")
        .map(Number);
      const [finHora, finMinuto] = turno.fin_turno.split(":").map(Number);

      const inicioTurno = new Date(ahora);

      inicioTurno.setHours(inicioHora, inicioMinuto, 0, 0);

      const finTurno = new Date(ahora);

      finTurno.setHours(finHora, finMinuto, 0, 0);

      if (finTurno < inicioTurno) {
        finTurno.setDate(finTurno.getDate() + 1);
      }

      if (ahora >= inicioTurno && ahora < finTurno) {
        turnoActual = turno.nombre_turno;

        if (turno.inicio_turno > turno.fin_turno) {
          const [inicioHora] = turno.inicio_turno.split(":").map(Number);

          if (ahora.getHours() < inicioHora) {
            const fecha = new Date(ahora);

            fecha.setDate(fecha.getDate() - 1);

            fechaTurnoActual = fecha.toISOString().split("T")[0];
          } else {
            fechaTurnoActual = ahora.toISOString().split("T")[0];
          }
        } else {
          fechaTurnoActual = ahora.toISOString().split("T")[0];
        }
      }

      if (turno.nombre_turno === turno_informe_inicial) {
        finTurnoInformeInicial = turno.fin_turno;
      }
    }

    const turnoInicial = turnos.find(
      (t) => t.nombre_turno === turno_informe_inicial,
    );

    if (turnoInicial) {
      // noinspection JSUnresolvedReference
      const [horaInicio] = turnoInicial.inicio_turno.split(":").map(Number);
      // noinspection JSUnresolvedReference
      const [horaFin, minutoFin] = turnoInicial.fin_turno
        .split(":")
        .map(Number);

      const [anio, mes, dia] = fecha_informe_inicial.split("-").map(Number);

      let fechaFinTurno = new Date(anio, mes - 1, dia, horaFin, minutoFin);

      if (horaFin < horaInicio) {
        fechaFinTurno.setDate(fechaFinTurno.getDate() + 1);
      }

      if (ahora < fechaFinTurno) {
        return res.json({ pendiente: false });
      }
    }

    // noinspection JSCheckFunctionSignatures
    const informeFinalExistente = await InformeFinal.findOne({
      where: {
        fecha_informe_final: fecha_informe_inicial,
        turno_informe_final: turno_informe_inicial,
      },
    });

    if (informeFinalExistente) {
      return res.json({ pendiente: false });
    }

    if (
      fecha_informe_inicial === fechaTurnoActual &&
      turno_informe_inicial === turnoActual
    ) {
      return res.json({ pendiente: false });
    }

    return res.json({
      pendiente: true,
      fecha: fecha_informe_inicial,
      turno: turno_informe_inicial,
      finTurno: finTurnoInformeInicial,
    });
  } catch (error) {
    console.error("Error al validar informe final pendiente:" + error);

    res.status(500).json({
      error: "Error al validar el estado del informe final pendiente",
    });
  }
};

exports.actualizarInformeInicial = async (req, res) => {
  const informe_inicial = req.body;

  try {
    const updatePromises = informe_inicial.map(async (informe) => {
      const informeInicial = await InformeInicial.findByPk(
        informe.id_informe_inicial,
      );

      if (informeInicial) {
        await informeInicial.update({
          titular_informe_inicial: informe.titular_informe_inicial,
          fecha_informe_inicial: informe.fecha_informe_inicial,
          hora_informe_inicial: informe.hora_informe_inicial,
          turno_informe_inicial: informe.turno_informe_inicial,
          bob_cat_informe_inicial: informe.bob_cat_informe_inicial,
          molino_informe_inicial: informe.molino_informe_inicial,
          referencia_informe_inicial: informe.referencia_informe_inicial,
          bulto_informe_inicial: informe.bulto_informe_inicial,
          horometro_informe_inicial: informe.horometro_informe_inicial,
          operador_informe_inicial: informe.operador_informe_inicial,
          carguero_informe_inicial: informe.carguero_informe_inicial,
          mecanico_informe_inicial: informe.mecanico_informe_inicial,
          cdc_informe_inicial: informe.cdc_informe_inicial,
          observacion_informe_inicial: informe.observacion_informe_inicial,
          actividad_informe_inicial: informe.actividad_informe_inicial,
        });

        return informeInicial;
      } else {
        throw new Error(
          `Informe inicial con id ${informe.id_informe_inicial} no encontrado`,
        );
      }
    });

    const resultados = await Promise.all(updatePromises);

    res.json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los informes iniciales" + error });
  }
};
