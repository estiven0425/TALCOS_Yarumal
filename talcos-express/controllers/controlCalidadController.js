const ControlCalidad = require("../models/ControlCalidad");

exports.leerControlCalidad = async (req, res) => {
  try {
    const controlesCalidad = await ControlCalidad.findAll({
      where: { actividad_control_calidad: true },
    });

    res.json(controlesCalidad);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearControlCalidad = async (req, res) => {
  const control_calidad = req.body;

  try {
    const nuevoControlCalidad =
      await ControlCalidad.bulkCreate(control_calidad);

    res.status(201).json(nuevoControlCalidad);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el control de calidad" + error });
  }
};

exports.actualizarControlCalidad = async (req, res) => {
  const control_calidad = req.body;

  try {
    const updatePromises = control_calidad.map(async (control) => {
      const controlCalidad = await ControlCalidad.findByPk(
        control.id_control_calidad,
      );

      if (controlCalidad) {
        await controlCalidad.update({
          fecha_control_calidad: control.fecha_control_calidad,
          hora_control_calidad: control.hora_control_calidad,
          turno_control_calidad: control.turno_control_calidad,
          molino_control_calidad: control.molino_control_calidad,
          referencia_control_calidad: control.referencia_control_calidad,
          bulto_control_calidad: control.bulto_control_calidad,
          retencion_control_calidad: control.retencion_control_calidad,
          rechazado_control_calidad: control.rechazado_control_calidad,
          observacion_control_calidad: control.observacion_control_calidad,
          actividad_control_calidad: control.actividad_control_calidad,
        });

        return controlCalidad;
      } else {
        throw new Error(
          `Control de calidad con id ${control.id_control_calidad} no encontrado`,
        );
      }
    });

    const resultados = await Promise.all(updatePromises);

    res.json(resultados);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los controles de calidad" + error });
  }
};
