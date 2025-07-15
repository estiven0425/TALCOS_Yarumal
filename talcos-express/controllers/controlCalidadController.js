const ControlCalidad = require("../models/ControlCalidad"); // Importa el modelo de Control de Calidad

exports.leerControlCalidad = async (req, res) => {
  // Controlador para obtener todos los controles de calidad activos
  try {
    const controlesCalidad = await ControlCalidad.findAll({
      // Busca todos los registros activos
      where: { actividad_control_calidad: true },
    });

    res.json(controlesCalidad); // Envía la respuesta con los controles encontrados
  } catch (error) {
    res.status(500).send("Error del servidor: " + error); // Maneja errores del servidor
  }
};

exports.crearControlCalidad = async (req, res) => {
  // Controlador para crear múltiples controles de calidad
  const control_calidad = req.body; // Obtiene los datos del cuerpo de la petición

  try {
    const nuevoControlCalidad =
      await ControlCalidad.bulkCreate(control_calidad); // Crea múltiples registros a la vez

    res.status(201).json(nuevoControlCalidad); // Envía respuesta exitosa con los nuevos controles
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al crear el control de calidad" + error }); // Maneja errores de creación
  }
};

exports.actualizarControlCalidad = async (req, res) => {
  // Controlador para actualizar múltiples controles
  const control_calidad = req.body; // Obtiene el array de controles a actualizar

  try {
    const updatePromises = control_calidad.map(async (control) => {
      // Mapea cada control para actualizarlo
      const controlCalidad = await ControlCalidad.findByPk(
        control.id_control_calidad,
      ); // Busca cada control por ID

      if (controlCalidad) {
        // Si existe el control
        await controlCalidad.update({
          // Actualiza todos los campos del control
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
        return controlCalidad; // Retorna el control actualizado
      } else {
        throw new Error(
          `Control de calidad con id ${control.id_control_calidad} no encontrado`,
        ); // Maneja control no encontrado
      }
    });

    const resultados = await Promise.all(updatePromises); // Espera que todas las actualizaciones terminen
    res.json(resultados); // Envía respuesta con todos los controles actualizados
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar los controles de calidad" + error }); // Maneja errores de actualización
  }
};
