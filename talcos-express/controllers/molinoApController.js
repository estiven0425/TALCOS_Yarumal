const MolinosAp = require("../models/MolinosAp");

exports.leerMolinoAp = async (req, res) => {
  try {
    const molinosAp = await MolinosAp.findAll({
      where: { actividad_molino_ap: true },
    });

    res.json(molinosAp);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearMolinoAp = async (req, res) => {
  const { nombre_molino_ap, horometro_molino_ap } = req.body;

  try {
    const nuevoMolinoAp = await MolinosAp.create({
      nombre_molino_ap,
      horometro_molino_ap,
    });

    res.status(201).json(nuevoMolinoAp);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el molino" + error });
  }
};

exports.actualizarMolinoAp = async (req, res) => {
  const {
    id_molino_ap,
    nombre_molino_ap,
    horometro_molino_ap,
    actividad_molino_ap,
  } = req.body;

  try {
    const molinoAp = await MolinosAp.findByPk(id_molino_ap);

    if (molinoAp) {
      await molinoAp.update({
        nombre_molino_ap,
        horometro_molino_ap,
        actividad_molino_ap,
      });

      res.json(molinoAp);
    } else {
      res.status(404).json({ error: "Molino AP no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el Molino AP" + error });
  }
};

exports.actualizarHorometrosMolinosAp = async (req, res) => {
  const actualizaciones = req.body;

  try {
    const resultados = await Promise.all(
      actualizaciones.map(async (actualizacion) => {
        const { id_molino_ap, horometro_molino_ap } = actualizacion;

        const molinoAp = await MolinosAp.findByPk(id_molino_ap);

        if (molinoAp) {
          await molinoAp.update({ horometro_molino_ap });

          return { id_molino_ap, mensaje: "Horómetro actualizado con éxito" };
        } else {
          return { id_molino_ap, error: "Molino AP no encontrado" };
        }
      }),
    );

    const errores = resultados.filter((resultado) => resultado.error);

    if (errores.length > 0) {
      return res.status(404).json({ errores });
    }

    res.json({
      mensaje: "Horómetros de molinos AP actualizados con éxito",
      resultados,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar los horómetros de los molinos AP",
      details: error.message,
    });
  }
};

exports.eliminarMolinoAp = async (req, res) => {
  const { id_molino_ap, actividad_molino_ap } = req.body;

  try {
    const molinoAp = await MolinosAp.findByPk(id_molino_ap);

    if (molinoAp) {
      await molinoAp.update({
        actividad_molino_ap,
      });

      res.json(molinoAp);
    } else {
      res.status(404).json({ error: "Molino AP no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el molino AP" + error });
  }
};
