const Molinos = require("../models/Molinos");

exports.leerMolino = async (req, res) => {
  try {
    const molinos = await Molinos.findAll({
      where: { actividad_molino: true },
    });

    res.json(molinos);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearMolino = async (req, res) => {
  const { nombre_molino, horometro_molino } = req.body;

  try {
    const nuevoMolino = await Molinos.create({
      nombre_molino,
      horometro_molino,
    });

    res.status(201).json(nuevoMolino);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el molino" + error });
  }
};

exports.actualizarMolino = async (req, res) => {
  const { id_molino, nombre_molino, horometro_molino, actividad_molino } =
    req.body;

  try {
    const molino = await Molinos.findByPk(id_molino);

    if (molino) {
      await molino.update({
        nombre_molino,
        horometro_molino,
        actividad_molino,
      });

      res.json(molino);
    } else {
      res.status(404).json({ error: "Molino no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el Molino" + error });
  }
};

exports.actualizarHorometrosMolinos = async (req, res) => {
  const actualizaciones = req.body;

  try {
    const resultados = await Promise.all(
      actualizaciones.map(async (actualizacion) => {
        const { id_molino, horometro_molino } = actualizacion;

        const molino = await Molinos.findByPk(id_molino);

        if (molino) {
          await molino.update({ horometro_molino });

          return { id_molino, mensaje: "Horómetro actualizado con éxito" };
        } else {
          return { id_molino, error: "Molino no encontrado" };
        }
      }),
    );

    const errores = resultados.filter((resultado) => resultado.error);

    if (errores.length > 0) {
      return res.status(404).json({ errores });
    }

    res.json({
      mensaje: "Horómetros de molinos actualizados con éxito",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar los horómetros de los molinos",
      details: error.message,
    });
  }
};

exports.eliminarMolino = async (req, res) => {
  const { id_molino, actividad_molino } = req.body;

  try {
    const molino = await Molinos.findByPk(id_molino);

    if (molino) {
      await molino.update({
        actividad_molino,
      });

      res.json(molino);
    } else {
      res.status(404).json({ error: "Molino no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el molino" + error });
  }
};
