const { Op } = require("sequelize");
const InformeInicial = require("../models/InformeInicial");
const InformeFinal = require("../models/InformeFinal");
const Turnos = require("../models/Turnos");

exports.leerInformeFinal = async (req, res) => {
  try {
    const informesFinales = await InformeFinal.findAll({
      where: { actividad_informe_final: true },
    });

    res.json(informesFinales);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.turnoInformeFinal = async (req, res) => {
  const { fecha, turno } = req.query;

  let fechaConsulta = new Date(fecha);

  fechaConsulta = fechaConsulta.toISOString().split("T")[0];

  try {
    const informes = await InformeFinal.findAll({
      where: {
        [Op.and]: [
          { fecha_informe_final: fechaConsulta },
          { turno_informe_final: turno },
          { actividad_informe_final: true },
        ],
      },
      order: [["hora_informe_final", "DESC"]],
    });

    res.json(informes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener informe final" + error });
  }
};

exports.crearInformeFinal = async (req, res) => {
  const informe_final = req.body;

  try {
    const nuevoInformeFinal = await InformeFinal.bulkCreate(informe_final);

    res.status(201).json(nuevoInformeFinal);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el informe final" + error });
  }
};

exports.obtenerUltimoInformeInicialPendiente = async (req, res) => {
  try {
    const ultimoInformeInicial = await InformeInicial.findOne({
      order: [
        ["fecha_informe_inicial", "DESC"],
        ["hora_informe_inicial", "DESC"],
      ],
    });

    if (!ultimoInformeInicial) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron informes iniciales." });
    }

    // noinspection JSCheckFunctionSignatures
    const informeFinalExistente = await InformeFinal.findOne({
      where: {
        fecha_informe_final: ultimoInformeInicial.fecha_informe_inicial,
        turno_informe_final: ultimoInformeInicial.turno_informe_inicial,
      },
    });

    if (informeFinalExistente) {
      return res.status(200).json({
        mensaje: "El informe ya ha finalizado.",
      });
    }

    // noinspection JSCheckFunctionSignatures
    const turno = await Turnos.findOne({
      where: { nombre_turno: ultimoInformeInicial.turno_informe_inicial },
    });

    if (!turno) {
      return res
        .status(404)
        .json({ mensaje: "No se encontró información del turno." });
    }

    res.json({
      fecha: ultimoInformeInicial.fecha_informe_inicial,
      turno: ultimoInformeInicial.turno_informe_inicial,
      finTurno: turno.fin_turno,
    });
  } catch (error) {
    console.error(
      "Error al obtener el último informe inicial pendiente:" + error,
    );
    res
      .status(500)
      .json({ error: "Error al obtener el informe inicial pendiente." });
  }
};

exports.actualizarInformeFinal = async (req, res) => {
  const informe_final = req.body;

  try {
    const updatePromises = informe_final.map(async (informe) => {
      const informeFinal = await InformeFinal.findByPk(
        informe.id_informe_final,
      );

      if (informeFinal) {
        await informeFinal.update({
          fecha_informe_final: informe.fecha_informe_final,
          hora_informe_final: informe.hora_informe_final,
          turno_informe_final: informe.turno_informe_final,
          molino_informe_final: informe.molino_informe_final,
          referencia_informe_final: informe.referencia_informe_final,
          bulto_informe_final: informe.bulto_informe_final,
          cantidad_informe_final: informe.cantidad_informe_final,
          horometro_informe_final: informe.horometro_informe_final,
          observacion_informe_final: informe.observacion_informe_final,
          actividad_informe_final: informe.actividad_informe_final,
        });
        return informeFinal;
      } else {
        throw new Error(
          `Informe final con id ${informe.id_informe_final} no encontrado`,
        );
      }
    });

    const resultados = await Promise.all(updatePromises);
    res.json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los informes finales" + error });
  }
};
