const bcrypt = require('bcrypt');
const Usuarios = require('../models/Usuarios');
const Perfiles = require('../models/Perfiles');

exports.leerUsuario = async (req, res) => {
    try {
        const usuarios = await Usuarios.findAll({
            include: [
                {
                    model: Perfiles,
                    as: 'perfil',
                    attributes: ['nombre_perfil'],
                    foreignKey: 'perfil_usuario'
                },
            ],
            where: { actividad_usuario: true }
        });

        res.json(usuarios);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.crearUsuario = async (req, res) => {
    const { nombre_usuario, documento_usuario, telefono_usuario, correo_usuario, contrato_usuario, perfil_usuario, contrasena_usuario } = req.body;

    try {
        const contrasenaEncriptada = await bcrypt.hash(contrasena_usuario, 10);
        const nuevoUsuario = await Usuarios.create({
            nombre_usuario,
            documento_usuario,
            telefono_usuario,
            correo_usuario,
            contrato_usuario,
            perfil_usuario,
            contrasena_usuario: contrasenaEncriptada
        });

        res.status(201).json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el usuario' });
    }
};

exports.actualizarUsuario = async (req, res) => {
    const {
        id_usuario,
        nombre_usuario,
        documento_usuario,
        telefono_usuario,
        correo_usuario,
        contrato_usuario,
        perfil_usuario,
        contrasena_usuario,
        actividad_usuario
    } = req.body;

    try {
        const usuario = await Usuarios.findByPk(id_usuario);

        if (usuario) {
            let contrasenaEncriptada = usuario.contrasena_usuario;

            const compare = await bcrypt.compare(contrasena_usuario, usuario.contrasena_usuario);
            if (!compare) {
                contrasenaEncriptada = await bcrypt.hash(contrasena_usuario, 10);
            }

            await usuario.update({
                nombre_usuario,
                documento_usuario,
                telefono_usuario,
                correo_usuario,
                contrato_usuario,
                perfil_usuario,
                contrasena_usuario: contrasenaEncriptada,
                actividad_usuario
            });

            res.json(usuario);
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
};