const { Op } = require("sequelize");
const InformeFinal = require("../models/InformeFinal");

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
  const { fecha, turno, inicioTurno, finTurno } = req.query;

  let fechaConsulta = new Date(fecha);

  const [horaInicio, minutoInicio] = inicioTurno.split(":").map(Number);
  const [horaFin, minutoFin] = finTurno.split(":").map(Number);

  if (horaFin < horaInicio) {
    fechaConsulta.setDate(fechaConsulta.getDate() - 1);
  }

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
    res.status(500).json({ error: "Error al obtener informe final" });
  }
};

exports.crearInformeFinal = async (req, res) => {
  const informe_final = req.body;

  try {
    const nuevoInformeFinal = await InformeFinal.bulkCreate(informe_final);

    res.status(201).json(nuevoInformeFinal);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el informe final" });
  }
};

exports.actualizarInformeFinal = async (req, res) => {
  const informe_final = req.body;

  try {
    const updatePromises = informe_final.map(async (informe) => {
      const informeFinal = await InformeFinal.findByPk(
        informe.id_informe_final
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
          `Informe final con id ${informe.id_informe_final} no encontrado`
        );
      }
    });

    const resultados = await Promise.all(updatePromises);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar los informes finales" });
  }
};
