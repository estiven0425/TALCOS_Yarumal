const { Op } = require('sequelize');
const InformeFinal = require('../models/InformeFinal');

exports.leerInformeFinal = async (req, res) => {
    try {
        const informesFinales = await InformeFinal.findAll({
            where: { actividad_informe_final: true }
        });

        res.json(informesFinales);
    } catch (error) {
        res.status(500).send('Error del servidor: ' + error);
    }
};

exports.turnoInformeFinal = async (req, res) => {
    const { fecha, turno, inicioTurno, finTurno } = req.query;

    let fechaConsulta = new Date(fecha);

    const [horaInicio, minutoInicio] = inicioTurno.split(':').map(Number);
    const [horaFin, minutoFin] = finTurno.split(':').map(Number);

    if (horaFin < horaInicio) {
        fechaConsulta.setDate(fechaConsulta.getDate() - 1);
    }

    fechaConsulta = fechaConsulta.toISOString().split('T')[0];

    try {
        const informes = await InformeFinal.findAll({
            where: {
                [Op.and]: [
                    { fecha_informe_final: fechaConsulta },
                    { turno_informe_final: turno },
                    { actividad_informe_final: true }
                ]
            },
            order: [['hora_informe_final', 'DESC']]
        });

        res.json(informes);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener informe final' });
    }
};

exports.crearInformeFinal = async (req, res) => {
    const {
        fecha_informe_final,
        hora_informe_final,
        turno_informe_final,
        molino_informe_final,
        referencia_informe_final,
        bulto_informe_final,
        cantidad_informe_final,
        horometro_informe_final,
        observacion_informe_final
    } = req.body;

    try {
        const nuevoInformeFinal = await InformeFinal.create({
            fecha_informe_final,
            hora_informe_final,
            turno_informe_final,
            molino_informe_final,
            referencia_informe_final,
            bulto_informe_final,
            cantidad_informe_final,
            horometro_informe_final,
            observacion_informe_final
        });

        res.status(201).json(nuevoInformeFinal);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el informe final' });
    }
};

exports.actualizarInformeFinal = async (req, res) => {
    const {
        id_informe_final,
        fecha_informe_final,
        hora_informe_final,
        turno_informe_final,
        molino_informe_final,
        referencia_informe_final,
        bulto_informe_final,
        cantidad_informe_final,
        horometro_informe_final,
        observacion_informe_final,
        actividad_informe_final
    } = req.body;

    try {
        const informeFinal = await InformeFinal.findByPk(id_informe_final);

        if (informeFinal) {
            await informeFinal.update({
                fecha_informe_final,
                hora_informe_final,
                turno_informe_final,
                molino_informe_final,
                referencia_informe_final,
                bulto_informe_final,
                cantidad_informe_final,
                horometro_informe_final,
                observacion_informe_final,
                actividad_informe_final
            });

            res.json(informeFinal);
        } else {
            res.status(404).json({ error: 'Informe final no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el informe final' });
    }
};