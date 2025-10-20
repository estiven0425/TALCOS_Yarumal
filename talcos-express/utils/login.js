const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");
const Perfiles = require("../models/Perfiles");
const Usuario = require("../models/Usuarios");

require("dotenv").config();

const router = express.Router();

const secretKey = process.env.JWT_SECRET;
const jwtExpires = process.env.JWT_EXPIRES || "10h";

router.post("/", async (req, res) => {
  try {
    const { documento_usuario, contrasena_usuario } = req.body;

    // noinspection JSCheckFunctionSignatures
    const usuario = await Usuario.findOne({
      where: { documento_usuario },
      include: [
        {
          model: Perfiles,
          as: "perfil",
          attributes: ["id_perfil"],
        },
      ],
    });

    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const contrasena = bcrypt.compareSync(
      contrasena_usuario,
      usuario.contrasena_usuario,
    );

    if (!contrasena) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const perfilesPermitidos = [1, 2, 3, 4];

    if (!perfilesPermitidos.includes(usuario.perfil.id_perfil)) {
      return res.status(403).json({ error: "Acceso denegado" });
    }

    const token = jwt.sign({ id_usuario: usuario.id_usuario }, secretKey, {
      expiresIn: jwtExpires,
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error de servidor: " + error.message });
  }
});

router.post("/get", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token requerido" });
    }

    const decoding = jwt.verify(token, secretKey);

    const usuario = await Usuario.findByPk(decoding.id_usuario, {
      include: [
        {
          model: Perfiles,
          as: "perfil",
          attributes: ["id_perfil", "nombre_perfil"],
        },
      ],
    });

    if (usuario) {
      res.json({
        id_usuario: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        documento_usuario: usuario.documento_usuario,
        telefono_usuario: usuario.telefono_usuario,
        correo_usuario: usuario.correo_usuario,
        contrato_usuario: usuario.contrato_usuario,
        perfil_usuario: usuario.perfil.nombre_perfil,
        id_perfil_usuario: usuario.perfil.id_perfil,
      });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" + error });
  }
});

module.exports = router;
