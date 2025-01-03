const ControlCalidad = require("../models/ControlCalidad");

exports.leerControlCalidad = async (req, res) => {
    try {
        const controlesCalidad = await ControlCalidad.findAll();

        res.json(controlesCalidad);
    } catch (error) {
        res.status(500).send("Error del servidor: " + error);
    }
};

exports.crearControlCalidad = async (req, res) => {
    const {
        fecha_control_calidad,
        hora_control_calidad,
        turno_control_calidad,
        molino_control_calidad,
        referencia_control_calidad,
        bulto_control_calidad,
        retencion_control_calidad,
        rechazado_control_calidad,
        observacion_control_calidad
    } = req.body;

    try {
        const nuevoControlCalidad = await ControlCalidad.create({
            fecha_control_calidad,
            hora_control_calidad,
            turno_control_calidad,
            molino_control_calidad,
            referencia_control_calidad,
            bulto_control_calidad,
            retencion_control_calidad,
            rechazado_control_calidad,
            observacion_control_calidad
        });

        res.status(201).json(nuevoControlCalidad);
    } catch (error) {
        res.status(500).json({ error: "Error al crear el control de calidad" });
    }
};

exports.actualizarControlCalidad = async (req, res) => {
    const {
        id_control_calidad,
        fecha_control_calidad,
        hora_control_calidad,
        turno_control_calidad,
        molino_control_calidad,
        referencia_control_calidad,
        bulto_control_calidad,
        retencion_control_calidad,
        rechazado_control_calidad,
        observacion_control_calidad,
        actividad_control_calidad
    } = req.body;

    try {
        const controlCalidad = await ControlCalidad.findByPk(id_control_calidad);

        if (controlCalidad) {
            await controlCalidad.update({
                fecha_control_calidad,
                hora_control_calidad,
                turno_control_calidad,
                molino_control_calidad,
                referencia_control_calidad,
                bulto_control_calidad,
                retencion_control_calidad,
                rechazado_control_calidad,
                observacion_control_calidad,
                actividad_control_calidad
            });

            res.json(controlCalidad);
        } else {
            res.status(404).json({ error: "Control de calidad no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar el control de calidad" });
    }
};