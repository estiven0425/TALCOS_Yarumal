const Bultos = require("../models/Bultos");

exports.leerBulto = async (req, res) => {
    try {
        const bultos = await Bultos.findAll();

        res.json(bultos);
    } catch (error) {
        res.status(500).send("Error del servidor: " + error);
    }
};

exports.crearBulto = async (req, res) => {
    const { nombre_bulto, capacidad_bulto } = req.body;

    try {
        const nuevoBulto = await Bultos.create({
            nombre_bulto,
            capacidad_bulto
        });

        res.status(201).json(nuevoBulto);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el bulto" });
    }
};

exports.actualizarBulto = async (req, res) => {
    const { id_bulto, nombre_bulto, capacidad_bulto, actividad_bulto } = req.body;

    try {
        const bulto = await Bultos.findByPk(id_bulto);

        if (bulto) {
            await bulto.update({
                nombre_bulto,
                capacidad_bulto,
                actividad_bulto
            });

            res.json(bulto);
        } else {
            res.status(404).json({ error: "Bulto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el bulto" });
    }
};