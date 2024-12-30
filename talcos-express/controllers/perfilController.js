const Perfiles = require("../models/Perfiles");

exports.leerPerfil = async (req, res) => {
    try {
        const perfiles = await Perfiles.findAll();

        res.json(perfiles);
    } catch (error) {
        res.status(500).send("Error del servidor: ", error);
    }
};

exports.crearPerfil = async (req, res) => {
    const { nombre_perfil, icono_perfil, actividad_perfil } = req.body;

    try {
        const nuevoPerfil = await Perfiles.create({
            nombre_perfil,
            icono_perfil,
            actividad_perfil
        });

        res.status(201).json(nuevoPerfil);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el perfil" });
    }
};

exports.actualizarPerfil = async (req, res) => {
    const { id_perfil, nombre_perfil, icono_perfil, actividad_perfil } = req.body;

    try {
        const perfil = await Perfiles.findByPk(id_perfil);

        if (perfil) {
            await perfil.update({
                nombre_perfil,
                icono_perfil,
                actividad_perfil
            });

            res.json(perfil);
        } else {
            res.status(404).json({ error: "Perfil no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el perfil" });
    }
};