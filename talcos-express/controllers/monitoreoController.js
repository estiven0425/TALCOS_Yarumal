const { Op } = require("sequelize");
const ControlCalidad = require("../models/ControlCalidad");
const InformeInicial = require("../models/InformeInicial");
const InformeFinal = require("../models/InformeFinal");
const Novedad = require("../models/Novedad");

exports.leerInforme = async (req, res) => {
  try {
    const { inicio, fin } = req.query;

    if (!inicio || !fin) {
      return res
        .status(400)
        .json({ error: "Las fechas de inicio y fin son obligatorias." });
    }

    const [
      datosInformeInicial,
      datosNovedades,
      datosControlCalidad,
      datosInformeFinal,
    ] = await Promise.all([
      InformeInicial.findAll({
        where: { fecha_informe_inicial: { [Op.between]: [inicio, fin] } },
      }),
      Novedad.findAll({
        where: { fecha_novedad: { [Op.between]: [inicio, fin] } },
      }),
      ControlCalidad.findAll({
        where: { fecha_control_calidad: { [Op.between]: [inicio, fin] } },
      }),
      InformeFinal.findAll({
        where: { fecha_informe_final: { [Op.between]: [inicio, fin] } },
      }),
    ]);

    res.json({
      informeInicial: datosInformeInicial,
      novedades: datosNovedades,
      controlCalidad: datosControlCalidad,
      informeFinal: datosInformeFinal,
    });
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};
