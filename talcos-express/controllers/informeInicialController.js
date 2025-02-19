const { Op } = require("sequelize");
const InformeInicial = require("../models/InformeInicial");
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
  const { fecha, turno, inicioTurno, finTurno } = req.query;

  let fechaConsulta = new Date(fecha);

  const [horaInicio, minutoInicio] = inicioTurno.split(":").map(Number);
  const [horaFin, minutoFin] = finTurno.split(":").map(Number);

  if (horaFin < horaInicio) {
    fechaConsulta.setDate(fechaConsulta.getDate() - 1);
  }

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
    res.status(500).json({ error: "Error al obtener informe inicial" });
  }
};

exports.crearInformeInicial = async (req, res) => {
  const informe_inicial = req.body;

  try {
    const nuevoInforme = await InformeInicial.bulkCreate(informe_inicial);

    res.status(201).json(nuevoInforme);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el informe inicial" });
  }
};

exports.actualizarInformeInicial = async (req, res) => {
  const informe_inicial = req.body;

  try {
    const updatePromises = informe_inicial.map(async (informe) => {
      const informeInicial = await InformeInicial.findByPk(
        informe.id_informe_inicial
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
          `Informe inicial con id ${informe.id_informe_inicial} no encontrado`
        );
      }
    });

    const resultados = await Promise.all(updatePromises);
    res.json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los informes iniciales" });
  }
};
