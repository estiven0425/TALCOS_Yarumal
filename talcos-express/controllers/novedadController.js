const Novedad = require('../models/Novedad');
const Usuarios = require('../models/Usuarios');

exports.leerNovedad = async (req, res) => {
    try {
        const novedades = await Novedad.findAll({
            include: [
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    foreignKey: 'operador_novedad'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    foreignKey: 'carguero_novedad'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    foreignKey: 'mecanico_novedad'
                }
            ],
            where: { actividad_novedad: true }
        });

        res.json(novedades);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.crearNovedad = async (req, res) => {
    const {
        fecha_novedad,
        hora_novedad,
        turno_novedad,
        tipo_novedad,
        molino_novedad,
        referencia_novedad,
        bulto_novedad,
        operador_novedad,
        bob_cat,
        carguero_novedad,
        mecanico_novedad,
        inicio_paro_novedad,
        fin_paro_novedad,
        horometro_inicio_paro_novedad,
        horometro_fin_paro_novedad,
        motivo_paro_novedad,
        observacion_novedad
    } = req.body;

    try {
        const nuevaNovedad = await Novedad.create({
            fecha_novedad,
            hora_novedad,
            turno_novedad,
            tipo_novedad,
            molino_novedad,
            referencia_novedad,
            bulto_novedad,
            operador_novedad,
            bob_cat,
            carguero_novedad,
            mecanico_novedad,
            inicio_paro_novedad,
            fin_paro_novedad,
            horometro_inicio_paro_novedad,
            horometro_fin_paro_novedad,
            motivo_paro_novedad,
            observacion_novedad
        });

        res.status(201).json(nuevaNovedad);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la novedad' });
    }
};

exports.actualizarNovedad = async (req, res) => {
    const {
        id_novedad,
        fecha_novedad,
        hora_novedad,
        turno_novedad,
        tipo_novedad,
        molino_novedad,
        referencia_novedad,
        bulto_novedad,
        operador_novedad,
        bob_cat,
        carguero_novedad,
        mecanico_novedad,
        inicio_paro_novedad,
        fin_paro_novedad,
        horometro_inicio_paro_novedad,
        horometro_fin_paro_novedad,
        motivo_paro_novedad,
        observacion_novedad,
        actividad_novedad
    } = req.body;

    try {
        const novedad = await Novedad.findByPk(id_novedad);

        if (novedad) {
            await novedad.update({
                fecha_novedad,
                hora_novedad,
                turno_novedad,
                tipo_novedad,
                molino_novedad,
                referencia_novedad,
                bulto_novedad,
                operador_novedad,
                bob_cat,
                carguero_novedad,
                mecanico_novedad,
                inicio_paro_novedad,
                fin_paro_novedad,
                horometro_inicio_paro_novedad,
                horometro_fin_paro_novedad,
                motivo_paro_novedad,
                observacion_novedad,
                actividad_novedad
            });

            res.json(novedad);
        } else {
            res.status(404).json({ error: 'Novedad no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la novedad' });
    }
};