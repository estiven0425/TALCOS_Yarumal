const { Op } = require('sequelize');
const InformeInicial = require('../models/InformeInicial');
const Usuarios = require('../models/Usuarios');

exports.leerInformeInicial = async (req, res) => {
    try {
        const informesIniciales = await InformeInicial.findAll({
            include: [
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'titular',
                    foreignKey: 'titular_informe_inicial'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'operador',
                    foreignKey: 'operador_informe_inicial'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'carguero',
                    foreignKey: 'carguero_informe_inicial'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'mecanico',
                    foreignKey: 'mecanico_informe_inicial'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'cdc',
                    foreignKey: 'cdc_informe_inicial'
                }
            ],
            where: { actividad_informe_inicial: true },
        });

        res.json(informesIniciales);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.turnoInformeInicial = async (req, res) => {
    const { fecha, turno, inicioTurno, finTurno } = req.query;

    let fechaConsulta = new Date(fecha);

    const [horaInicio, minutoInicio] = inicioTurno.split(':').map(Number);
    const [horaFin, minutoFin] = finTurno.split(':').map(Number);

    if (horaFin < horaInicio) {
        fechaConsulta.setDate(fechaConsulta.getDate() - 1);
    }

    fechaConsulta = fechaConsulta.toISOString().split('T')[0];

    try {
        const informes = await InformeInicial.findAll({
            include: [
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'titular'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'operador'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'carguero'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'mecanico'
                },
                {
                    model: Usuarios,
                    attributes: ['nombre_usuario'],
                    as: 'cdc'
                },
            ],
            where: {
                [Op.and]: [
                    { fecha_informe_inicial: fechaConsulta },
                    { turno_informe_inicial: turno },
                    { actividad_informe_inicial: true }
                ]
            },
            order: [['hora_informe_inicial', 'DESC']]
        });

        res.json(informes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener informe inicial' });
    }
};

exports.crearInformeInicial = async (req, res) => {
    const {
        titular_informe_inicial,
        fecha_informe_inicial,
        hora_informe_inicial,
        turno_informe_inicial,
        bob_cat_informe_inicial,
        molino_informe_inicial,
        referencia_informe_inicial,
        bulto_informe_inicial,
        horometro_informe_inicial,
        operador_informe_inicial,
        carguero_informe_inicial,
        mecanico_informe_inicial,
        cdc_informe_inicial,
        observacion_informe_inicial
    } = req.body;

    try {
        const nuevoInforme = await InformeInicial.create({
            titular_informe_inicial,
            fecha_informe_inicial,
            hora_informe_inicial,
            turno_informe_inicial,
            bob_cat_informe_inicial,
            molino_informe_inicial,
            referencia_informe_inicial,
            bulto_informe_inicial,
            horometro_informe_inicial,
            operador_informe_inicial,
            carguero_informe_inicial,
            mecanico_informe_inicial,
            cdc_informe_inicial,
            observacion_informe_inicial
        });

        res.status(201).json(nuevoInforme);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el informe inicial' });
    }
};

exports.actualizarInformeInicial = async (req, res) => {
    const {
        id_informe_inicial,
        titular_informe_inicial,
        fecha_informe_inicial,
        hora_informe_inicial,
        turno_informe_inicial,
        bob_cat_informe_inicial,
        molino_informe_inicial,
        referencia_informe_inicial,
        bulto_informe_inicial,
        horometro_informe_inicial,
        operador_informe_inicial,
        carguero_informe_inicial,
        mecanico_informe_inicial,
        cdc_informe_inicial,
        observacion_informe_inicial,
        actividad_informe_inicial
    } = req.body;

    try {
        const informe = await InformeInicial.findByPk(id_informe_inicial);

        if (informe) {
            await informe.update({
                titular_informe_inicial,
                fecha_informe_inicial,
                hora_informe_inicial,
                turno_informe_inicial,
                bob_cat_informe_inicial,
                molino_informe_inicial,
                referencia_informe_inicial,
                bulto_informe_inicial,
                horometro_informe_inicial,
                operador_informe_inicial,
                carguero_informe_inicial,
                mecanico_informe_inicial,
                cdc_informe_inicial,
                observacion_informe_inicial,
                actividad_informe_inicial
            });

            res.json(informe);
        } else {
            res.status(404).json({ error: 'Informe inicial no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el informe inicial' });
    }
};