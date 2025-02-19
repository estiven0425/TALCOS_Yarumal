const Turnos = require("../models/Turnos");

exports.leerTurno = async (req, res) => {
  try {
    const turnos = await Turnos.findAll({
      where: { actividad_turno: true },
    });

    res.json(turnos);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearTurno = async (req, res) => {
  const { nombre_turno, inicio_turno, fin_turno } = req.body;

  try {
    const nuevoTurno = await Turnos.create({
      nombre_turno,
      inicio_turno,
      fin_turno,
    });

    res.status(201).json(nuevoTurno);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el turno" });
  }
};

exports.actualizarTurno = async (req, res) => {
  const { id_turno, nombre_turno, inicio_turno, fin_turno, actividad_turno } =
    req.body;

  try {
    const turno = await Turnos.findByPk(id_turno);

    if (turno) {
      await turno.update({
        nombre_turno,
        inicio_turno,
        fin_turno,
        actividad_turno,
      });

      res.json(turno);
    } else {
      res.status(404).json({ error: "Turno no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el turno" });
  }
};

exports.eliminarTurno = async (req, res) => {
  const { id_turno, actividad_turno } = req.body;

  try {
    const turno = await Turnos.findByPk(id_turno);

    if (turno) {
      await turno.update({
        actividad_turno,
      });

      res.json(turno);
    } else {
      res.status(404).json({ error: "Turno no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el turno" });
  }
};
