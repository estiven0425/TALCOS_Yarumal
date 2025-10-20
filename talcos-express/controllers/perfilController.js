const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../config/conectionDataBase");
const Perfiles = require("../models/Perfiles");

exports.leerPerfil = async (req, res) => {
  try {
    const perfiles = await Perfiles.findAll({
      where: { actividad_perfil: true },
    });

    res.json(perfiles);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.personalPerfil = async (req, res) => {
  const { perfil } = req.query;

  try {
    const perfiles = await Perfiles.findAll({
      where: {
        [Op.and]: [{ id_perfil: perfil }, { actividad_perfil: true }],
      },
    });

    res.json(perfiles);
  } catch (error) {
    res.status(500).send("Error del servidor: " + error);
  }
};

exports.conteoPerfil = async (req, res) => {
  try {
    const [perfiles] = await sequelize.query(
      "CALL obtener_usuarios_de_perfil()",
      {
        type: QueryTypes.SELECT,
      },
    );

    res.json(perfiles);
  } catch (error) {
    console.error("Error al obtener los perfiles:", error);

    res.status(500).send("Error del servidor: " + error);
  }
};

exports.crearPerfil = async (req, res) => {
  const { nombre_perfil } = req.body;

  try {
    const nuevoPerfil = await Perfiles.create({
      nombre_perfil,
    });

    res.status(201).json(nuevoPerfil);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el perfil" + error });
  }
};

exports.actualizarPerfil = async (req, res) => {
  const { id_perfil, nombre_perfil, actividad_perfil } = req.body;

  try {
    const perfil = await Perfiles.findByPk(id_perfil);

    if (perfil) {
      await perfil.update({
        nombre_perfil,
        actividad_perfil,
      });

      res.json(perfil);
    } else {
      res.status(404).json({ error: "Perfil no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el perfil" + error });
  }
};

exports.eliminarPerfil = async (req, res) => {
  const { id_perfil, actividad_perfil } = req.body;

  try {
    const perfil = await Perfiles.findByPk(id_perfil);

    if (perfil) {
      await perfil.update({
        actividad_perfil,
      });

      res.json(perfil);
    } else {
      res.status(404).json({ error: "Perfil no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el perfil" + error });
  }
};
