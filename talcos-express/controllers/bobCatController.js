const BobCats = require("../models/BobCats");

exports.leerBobCat = async (req, res) => {
    try {
        const bobCats = await BobCats.findAll();

        res.json(bobCats);
    } catch (error) {
        res.status(500).send("Error del servidor: " + error);
    }
};

exports.crearBobCat = async (req, res) => {
    const { nombre_bob_cat } = req.body;

    try {
        const nuevoBobCat = await BobCats.create({
            nombre_bob_cat
        });

        res.status(201).json(nuevoBobCat);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el BobCat" });
    }
};

exports.actualizarBobCat = async (req, res) => {
    const { id_bob_cat, nombre_bob_cat, actividad_bob_cat } = req.body;

    try {
        const bobCat = await BobCats.findByPk(id_bob_cat);

        if (bobCat) {
            await bobCat.update({
                nombre_bob_cat,
                actividad_bob_cat
            });

            res.json(bobCat);
        } else {
            res.status(404).json({ error: "BobCat no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el BobCat" });
    }
};
