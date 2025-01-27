const Mensajes = require('../models/Mensajes');
const Usuarios = require('../models/Usuarios');

exports.leerMensaje = async (req, res) => {
    try {
        const mensajes = await Mensajes.findAll({
            include: [
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'emisor',
                    foreignKey: 'emisor_mensaje'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'receptor',
                    foreignKey: 'receptor_mensaje'
                }
            ],
        });

        res.json(mensajes);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.crearMensaje = async (req, res) => {
    const { fecha_mensaje, hora_mensaje, texto_mensaje, emisor_mensaje, receptor_mensaje } = req.body;

    try {
        const nuevoMensaje = await Mensajes.create({
            fecha_mensaje,
            hora_mensaje,
            texto_mensaje,
            emisor_mensaje,
            receptor_mensaje
        });

        res.status(201).json(nuevoMensaje);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el mensaje' });
    }
};

exports.actualizarMensaje = async (req, res) => {
    const { id_mensaje, fecha_mensaje, hora_mensaje, texto_mensaje, emisor_mensaje, receptor_mensaje } = req.body;

    try {
        const mensaje = await Mensajes.findByPk(id_mensaje);

        if (mensaje) {
            await mensaje.update({
                fecha_mensaje,
                hora_mensaje,
                texto_mensaje,
                emisor_mensaje,
                receptor_mensaje
            });

            res.json(mensaje);
        } else {
            res.status(404).json({ error: 'Mensaje no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el mensaje' });
    }
};