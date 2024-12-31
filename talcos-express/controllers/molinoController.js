const Molinos = require("../models/Molinos");

exports.leerMolino = async (req, res) => {
    try {
        const molinos = await Molinos.findAll();

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
            horometro_molino
        });

        res.status(201).json(nuevoMolino);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el molino" });
    }
};

exports.actualizarMolino = async (req, res) => {
    const { id_molino, nombre_molino, horometro_molino, actividad_molino } = req.body;

    try {
        const molino = await Molinos.findByPk(id_molino);

        if (molino) {
            await molino.update({
                nombre_molino,
                horometro_molino,
                actividad_molino
            });

            res.json(molino);
        } else {
            res.status(404).json({ error: "Molino no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el Molino" });
    }
};