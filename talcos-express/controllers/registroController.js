const Registros = require('../models/Registros');
const Usuarios = require('../models/Usuarios');

exports.leerRegistro = async (req, res) => {
    try {
        const registros = await Registros.findAll({
            include: [
                {
                    model: Usuarios,
                    as: 'titular',
                    attributes: ['nombre_usuario'],
                    foreignKey: 'titular_registro'
                },
                {
                    model: Usuarios,
                    as: 'proveedor',
                    attributes: ['nombre_usuario'],
                    foreignKey: 'proveedor_registro'
                }
            ],
        });

        res.json(registros);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.crearRegistro = async (req, res) => {
    const {
        fecha_registro,
        titular_registro,
        proveedor_registro,
        mp_registro,
        valor_mp_registro,
        valor_t_registro,
        peso_mp_registro,
        peso_neto_registro,
        observacion_registro } = req.body;

    try {
        const nuevoRegistro = await Registros.create({
            fecha_registro,
            titular_registro,
            proveedor_registro,
            mp_registro,
            valor_mp_registro,
            valor_t_registro,
            peso_mp_registro,
            peso_neto_registro,
            observacion_registro
        });

        res.status(201).json(nuevoRegistro);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el registro' });
    }
};

exports.actualizarRegistro = async (req, res) => {
    const {
        id_registro,
        fecha_registro,
        titular_registro,
        proveedor_registro,
        mp_registro,
        valor_mp_registro,
        valor_t_registro,
        peso_mp_registro,
        peso_neto_registro,
        observacion_registro,
        actualizacion_registro
    } = req.body;

    try {
        const registro = await Registros.findByPk(id_registro);

        if (registro) {
            await registro.update({
                fecha_registro,
                titular_registro,
                proveedor_registro,
                mp_registro,
                valor_mp_registro,
                valor_t_registro,
                peso_mp_registro,
                peso_neto_registro,
                observacion_registro,
                actualizacion_registro
            });

            res.json(registro);
        } else {
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el registro' });
    }
};