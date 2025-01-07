const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Usuario = require('../models/Usuarios');
const Perfiles = require('../models/Perfiles');

const router = express.Router();

const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

let secretKey;

router.post('/', async (req, res) => {
    try {
        const { nombre_usuario, contrasena_usuario } = req.body;

        const usuario = await Usuario.findOne({ where: { nombre_usuario } });

        if (usuario && bcrypt.compareSync(contrasena_usuario, usuario.contrasena_usuario)) {
            secretKey = generateSecretKey();

            const token = jwt.sign({ id_usuario: usuario.id_usuario }, secretKey);

            res.json({ token });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
});
router.post('/get', async (req, res) => {
    try {
        const { token } = req.body;

        if (!secretKey) {
            return res.status(401).json({ error: 'No se ha generado la clave secreta' });
        }

        const decoding = jwt.verify(token, secretKey);
        const usuario = await Usuario.findByPk(decoding.id_usuario, {
            include: [
                {
                    model: Perfiles,
                    attributes: ['nombre_perfil']
                },
            ],
        });
        console.log(usuario);
        if (usuario) {
            res.json({
                nombre_usuario: usuario.nombre_usuario,
                documento_usuario: usuario.documento_usuario,
                telefono_usuario: usuario.telefono_usuario,
                correo_usuario: usuario.correo_usuario,
                contrato_usuario: usuario.contrato_usuario,
                perfil_usuario: usuario.perfile.nombre_perfil
            });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error de servidor' });
    }
});

module.exports = router;