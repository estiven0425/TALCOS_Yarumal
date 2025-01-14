const MateriasPrimas = require('../models/MateriasPrimas');

exports.leerMateriaPrima = async (req, res) => {
    try {
        const materiasPrimas = await MateriasPrimas.findAll({
            where: { actividad_materia_prima: true }
        });

        res.json(materiasPrimas);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.crearMateriaPrima = async (req, res) => {
    const { nombre_materia_prima, cantidad_materia_prima } = req.body;

    try {
        const nuevaMateriaPrima = await MateriasPrimas.create({
            nombre_materia_prima,
            cantidad_materia_prima
        });

        res.status(201).json(nuevaMateriaPrima);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la materia prima' });
    }
};

exports.actualizarMateriaPrima = async (req, res) => {
    const { id_materia_prima, nombre_materia_prima, cantidad_materia_prima, actividad_materia_prima } = req.body;

    try {
        const materiaPrima = await MateriasPrimas.findByPk(id_materia_prima);

        if (materiaPrima) {
            await materiaPrima.update({
                nombre_materia_prima,
                cantidad_materia_prima,
                actividad_materia_prima
            });

            res.json(materiaPrima);
        } else {
            res.status(404).json({ error: 'Materia prima no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la materia prima' });
    }
};