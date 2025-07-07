import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-raw-material-register-form.module.css";

function InventoryCreateAggregate() {
    const [operador, setOperador] = useState([]);
    const [carguero, setCarguero] = useState([]);
    const [turno, setTurno] = useState([]);
    const [molinoAP, setMolinoAP] = useState([]);
    const [bobCat, setbobCat] = useState([]);
    const [titularRegistroAp, setTitularRegistroAp] = useState("");
    const [turnoRegistroAp, setTurnoRegistroAp] = useState("");
    const [operadorRegistroAp, setOperadorRegistroAp] = useState("");
    const [ingresoRocaRegistroAp, setIngresoRocaRegistroAp] =
        useState("");
    const [bobCatRocaRegistroAp, setBobCatRocaRegistroAp] =
        useState("");
    const [ingresoGruesoRegistroAp, setIngresoGruesoRegistroAp] =
        useState("");
    const [bobCatGruesoRegistroAp, setBobCatGruesoRegistroAp] =
        useState("");
    const [pesoBobCatRegistroAp, setPesoBobCatRegistroAp] = useState("");
    const [totalRocaRegistroAp, settotalRocaRegistroAp] = useState("");
    const [totalGruesoRegistroAp, settotalGruesoRegistroAp] = useState("");
    const [molinoApRegistroAp, setMolinoApRegistroAp] = useState("");
    const [horometroInicioRegistroAp, setHorometroInicioRegistroAp] = useState("");
    const [horometroFinRegistroAp, setHorometroFinRegistroAp] = useState("");
    const [cargueroRegistroAp, setCargueroRegistroAp] = useState("");
    const [observacionRegistroAp, setObservacionRegistroAp] = useState("");
    const [loading, setLoading] = useState(false);
    const [SendStatus, setSendStatus] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const getUsuario = async () => {
            try {
                const response = await axios.post(`http://${localIP}:3000/login/get`, {
                    token: token,
                });

                setTitularRegistroAp(response.data.id_usuario);
            } catch (error) {
                console.error("Error al obtener el usuario: ", error);
            }
        };
        getUsuario();
    }, [localIP]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const [operadorRes, cargueroRes] =
                    await Promise.all([
                        axios.post(
                            `http://${localIP}:3000/usuarios/informeinicialusuario`,
                            { idPerfil: 6 }
                        ),
                        axios.post(
                            `http://${localIP}:3000/usuarios/informeinicialusuario`,
                            { idPerfil: 8 }
                        ),
                    ]);

                setOperador(operadorRes.data);
                setCarguero(cargueroRes.data);
            } catch (error) {
                console.error("Error al obtener usuarios por perfil:", error);
            }
        };

        getUsers();
    }, [localIP]);

    useEffect(() => {
        const getItems = async () => {
            try {
                const [turnoRes, molinoApRes, bobCatRes] =
                    await Promise.all([
                        axios.get(`http://${localIP}:3000/turnos`),
                        axios.get(`http://${localIP}:3000/molinos`),
                        axios.get(`http://${localIP}:3000/bob_cats`),
                    ]);

                setTurno(turnoRes.data);
                setMolinoAP(molinoApRes.data);
                setbobCat(bobCatRes.data);
            } catch (error) {
                console.error("Error al obtener datos:", error);
            }
        };

        getItems();
    }, [localIP]);

    useEffect(() => {
        if (SendStatus) {
            const timer = setTimeout(() => {
                navigate("/inventory/inventoryaggregate");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [SendStatus, navigate]);

    const validation = () => {
        const errors = {};

        if (!turnoRegistroAp) {
            errors.turnoRegistroAp = "El turno del registro AP es obligatorio.";
        }
        if (!operadorRegistroAp) {
            errors.operadorRegisroAp = "El operador del molino AP del registro AP es obligatorio.";
        }
        if (!ingresoRocaRegistroAp) {
            errors.ingresoRocaRegistroAp = "El ingreso de roca del registro AP es obligatorio.";
        } else if (
            !/^\d+(\.\d+)?$/.test(ingresoRocaRegistroAp)
        ) {
            errors.ingresoRocaRegistroAp =
                "El ingreso de roca del registro AP debe ser un número válido.";
        }
        if (!bobCatRocaRegistroAp) {
            errors.bobCatRocaRegistroAp = "Las cocadas del bob-cat de roca del registro AP es obligatoria.";
        }else if (
            !/^[0-9]+$/.test(bobCatRocaRegistroAp)
        ) {
            errors.bobCatRocaRegistroAp =
                "Las cocadas del bob-cat de roca del registro AP deben ser un número válido.";
        }
        if (!ingresoGruesoRegistroAp) {
            errors.ingresoGruesoRegistroAp = "El ingreso de grueso del registro AP es obligatorio.";
        } else if (
            !/^\d+(\.\d+)?$/.test(ingresoGruesoRegistroAp)
        ) {
            errors.ingresoGruesoRegistroAp =
                "El ingreso de grueso del registro AP debe ser un número válido.";
        }
        if (!bobCatGruesoRegistroAp) {
            errors.bobCatGruesoRegistroAp = "Las cocadas del bob-cat de grueso del registro AP es obligatoria.";
        }else if (
            !/^[0-9]+$/.test(bobCatGruesoRegistroAp)
        ) {
            errors.bobCatGruesoRegistroAp =
                "Las cocadas del bob-cat de grueso del registro AP deben ser un número válido.";
        }
        if (!pesoBobCatRegistroAp) {
            errors.pesoBobCatRegistroAp = "El peso del bob-cat del registro AP es obligatorio.";
        }else if (
            !/^[0-9]+$/.test(pesoBobCatRegistroAp)
        ) {
            errors.pesoBobCatRegistroAp =
                "El peso del bob-cat del registro AP debe ser un número válido.";
        }
        if (!totalRocaRegistroAp) {
            errors.totalRocaRegistroAp = "El total de roca del registro AP es obligatorio.";
        } else if (
            !/^\d+(\.\d+)?$/.test(totalRocaRegistroAp)
        ) {
            errors.totalRocaRegistroAp =
                "El total de roca del registro AP debe ser un número válido.";
        }
        if (!totalGruesoRegistroAp) {
            errors.totalGruesoRegistroAp = "El total de grueso del registro AP es obligatorio.";
        } else if (
            !/^\d+(\.\d+)?$/.test(totalGruesoRegistroAp)
        ) {
            errors.totalGruesoRegistroAp =
                "El total de grueso del registro AP debe ser un número válido.";
        }
        if (!molinoApRegistroAp) {
            errors.molinoApRegistroAp = "El molino AP del registro AP es obligatorio."
        }
        if (!horometroInicioRegistroAp) {
            errors.horometroInicioRegistroAp = "El horómetro de inicio del molino AP del registro AP es obligatorio.";
        }else if (
            !/^[0-9]+$/.test(horometroInicioRegistroAp)
        ) {
            errors.horometroInicioRegistroAp =
                "El horómetro de inicio del molino AP del registro AP debe ser un número válido.";
        }
        if (!horometroFinRegistroAp) {
            errors.horometroFinRegistroAp = "El horómetro de fin del molino AP del registro AP es obligatorio.";
        }else if (
            !/^[0-9]+$/.test(horometroFinRegistroAp)
        ) {
            errors.horometroFinRegistroAp =
                "El horómetro de fin del molino AP del registro AP debe ser un número válido.";
        }
        if (!cargueroRegistroAp) {
            errors.cargueroRegistroAp = "El operador del minicargador del registro AP es obligatorio."
        }

        setValidationError(errors);
        setLoading(false);

        return Object.keys(errors).length === 0;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);

                    if (
                        typeof jsonData === "object" &&
                        !Array.isArray(jsonData) &&
                        jsonData !== null
                    ) {
                        const jsonArray = [jsonData];
                        setDatosArchivo(jsonArray);
                        setArchivoRegistro(file.name);
                        setValidationError({});
                    } else if (
                        Array.isArray(jsonData) &&
                        jsonData.every((item) =>
                            [
                                "fecha_registro",
                                "remision_registro",
                                "nombre_proveedor_registro",
                                "documento_proveedor_registro",
                                "nombre_transportador_registro",
                                "documento_transportador_registro",
                                "mp_registro",
                                "valor_mp_registro",
                                "peso_mp_registro",
                                "concepto_registro",
                                "zona_registro",
                                "bonificacion_registro",
                                "valor_t_registro",
                                "observacion_registro",
                            ].every((key) => key in item)
                        )
                    ) {
                        setDatosArchivo(jsonData);
                        setArchivoRegistro(file.name);
                        setValidationError({});
                    } else {
                        throw new Error("Estructura del JSON no válida.");
                    }
                } catch (error) {
                    setValidationError({
                        archivoRegistro:
                            "El archivo no es un JSON válido o tiene una estructura incorrecta.",
                    });
                }
            };
            reader.readAsText(file);
        }
    };

    const sendCreateRegister = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        const fechaRegistro = new Date().toISOString().split("T")[0];
        const horaRegistro = new Date().toLocaleTimeString("en-GB", {
            hour12: false,
        });
        const monthRegistro = new Date().getMonth() + 1;
        const fullRecord = {
            fecha_registro: fechaRegistro,
            hora_registro: horaRegistro,
            mes_registro: monthRegistro,
            titular_registro: titularRegistro,
            remision_registro: remisionRegistro,
            nombre_proveedor_registro: nombreProveedorRegistro,
            documento_proveedor_registro: documentoProveedorRegistro,
            nombre_transportador_registro: nombreTransportadorRegistro,
            documento_transportador_registro: documentoTransportadorRegistro,
            tipo_registro: tipoRegistro,
            mp_registro: mpRegistro,
            valor_mp_registro: valorMpRegistro,
            peso_mp_registro: pesoMpRegistro,
            concepto_registro: conceptoRegistro,
            zona_registro: zonaRegistro,
            bonificacion_registro: bonificacionRegistro,
            valor_t_registro: valorTRegistro,
            observacion_registro: observacionRegistro,
        };

        try {
            await axios.post(`http://${localIP}:3000/registros`, {
                fullRecord: fullRecord,
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError(
                    "Error al crear el registro. Por favor, inténtelo de nuevo."
                );
                setLoading(false);
            }
        }
    };

    const sendCreateRegisterSecondary = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        const horaRegistro = new Date().toLocaleTimeString("en-GB", {
            hour12: false,
        });
        const monthRegistro = new Date().getMonth() + 1;
        const fullRecord = datosArchivo.map((registro) => ({
            ...registro,
            hora_registro: horaRegistro,
            mes_registro: monthRegistro,
            titular_registro: titularRegistro,
            tipo_registro: tipoRegistro,
        }));

        try {
            await axios.post(
                `http://${localIP}:3000/registros/importarregistro`,
                fullRecord
            );

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError(
                    "Error al crear el registro. Por favor, inténtelo de nuevo."
                );
                setLoading(false);
            }
        }
    };

    return (
        <>
            {SendStatus === true ? (
                <motion.div
                    className={Style.inventoryCreateRawMaterialRegisterAlternative}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Registro creado con éxito</h1>
                </motion.div>
            ) : (
                <motion.form
                    className={Style.inventoryCreateRawMaterialRegister}
                    onSubmit={sendCreateRegister}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <header className={Style.inventoryCreateRawMaterialRegisterHeader}>
                        <h1>
                            Complete los datos para crear un nuevo registro de materia prima
                        </h1>
                    </header>
                    <main className={Style.inventoryCreateRawMaterialRegisterMain}>
                        <div>
                            <fieldset
                                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
                            >
                                <label htmlFor="remisionRegistro">Remisión</label>
                                <input
                                    id="remisionRegistro"
                                    name="remisionRegistro"
                                    onChange={(e) => setRemisionRegistro(e.target.value)}
                                    placeholder="Ingresa la remisión del registro"
                                    type="text"
                                    value={remisionRegistro}
                                />
                                {!validationError.remisionRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.remisionRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="proveedorRegistro">Proveedor</label>
                                <select
                                    id="proveedorRegistro"
                                    name="proveedorRegistro"
                                    onChange={(e) => {
                                        const selected = JSON.parse(e.target.value);

                                        setNombreProveedorRegistro(selected.nombre_usuario);
                                        setDocumentoProveedorRegistro(selected.documento_usuario);
                                    }}
                                    value={
                                        nombreProveedorRegistro
                                            ? JSON.stringify(
                                                proveedor.find(
                                                    (proveedor) =>
                                                        proveedor.nombre_usuario ===
                                                        nombreProveedorRegistro
                                                )
                                            )
                                            : ""
                                    }
                                >
                                    <option value="" disabled>
                                        Selecciona un proveedor
                                    </option>
                                    {proveedor.map((proveedor) => (
                                        <option
                                            key={proveedor.id_usuario}
                                            value={JSON.stringify(proveedor)}
                                        >
                                            {proveedor.nombre_usuario}
                                        </option>
                                    ))}
                                </select>
                                {!validationError.proveedorRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.proveedorRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="transportadorRegistro">Transportador</label>
                                <select
                                    id="transportadorRegistro"
                                    name="transportadorRegistro"
                                    onChange={(e) => {
                                        const selected = JSON.parse(e.target.value);

                                        setNombreTransportadorRegistro(selected.nombre_usuario);
                                        setDocumentoTransportadorRegistro(
                                            selected.documento_usuario
                                        );
                                    }}
                                    value={
                                        nombreTransportadorRegistro
                                            ? JSON.stringify(
                                                transportador.find(
                                                    (transportador) =>
                                                        transportador.nombre_usuario ===
                                                        nombreTransportadorRegistro
                                                )
                                            )
                                            : ""
                                    }
                                >
                                    <option value="" disabled>
                                        Selecciona un transportador
                                    </option>
                                    {transportador.map((transportador) => (
                                        <option
                                            key={transportador.id_usuario}
                                            value={JSON.stringify(transportador)}
                                        >
                                            {transportador.nombre_usuario}
                                        </option>
                                    ))}
                                </select>
                                {!validationError.transportadorRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.transportadorRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset
                                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
                            >
                                <label htmlFor="mpRegistro">Materia Prima</label>
                                <select
                                    id="mpRegistro"
                                    name="mpRegistro"
                                    onChange={(e) => setMpRegistro(e.target.value)}
                                    value={mpRegistro}
                                >
                                    <option value="" disabled>
                                        Selecciona una materia prima
                                    </option>
                                    {materiaPrima.map((mp) => (
                                        <option
                                            key={mp.nombre_materia_prima}
                                            value={mp.nombre_materia_prima}
                                        >
                                            {mp.nombre_materia_prima}
                                        </option>
                                    ))}
                                </select>
                                {!validationError.mpRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.mpRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="valorMpRegistro">Valor Materia Prima</label>
                                <input
                                    id="valorMpRegistro"
                                    name="valorMpRegistro"
                                    onChange={(e) => setValorMpRegistro(e.target.value)}
                                    placeholder="Ingresa el valor de la materia prima"
                                    type="text"
                                    value={valorMpRegistro}
                                />
                                {!validationError.valorMpRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.valorMpRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="pesoMpRegistro">Peso Materia Prima</label>
                                <input
                                    id="pesoMpRegistro"
                                    name="pesoMpRegistro"
                                    onChange={(e) => setPesoMpRegistro(e.target.value)}
                                    placeholder="Ingresa el peso de la materia prima"
                                    type="text"
                                    value={pesoMpRegistro}
                                />
                                {!validationError.pesoMpRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.pesoMpRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="conceptoRegistro">Concepto</label>
                                <input
                                    id="conceptoRegistro"
                                    name="conceptoRegistro"
                                    onChange={(e) => setConceptoRegistro(e.target.value)}
                                    placeholder="Ingresa el concepto del registro"
                                    type="text"
                                    value={conceptoRegistro}
                                />
                                {!validationError.conceptoRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.conceptoRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="zonaRegistro">Zona</label>
                                <input
                                    id="zonaRegistro"
                                    name="zonaRegistro"
                                    onChange={(e) => setZonaRegistro(e.target.value)}
                                    placeholder="Ingresa la zona del registro"
                                    type="text"
                                    value={zonaRegistro}
                                />
                                {!validationError.zonaRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.zonaRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset
                                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
                            >
                                <label htmlFor="bonificacionRegistro">
                                    Bonificación por tonelada
                                </label>
                                <input
                                    id="bonificacionRegistro"
                                    name="bonificacionRegistro"
                                    onChange={(e) => setBonificacionRegistro(e.target.value)}
                                    placeholder="Ingresa la bonificación por tonelada del registro"
                                    type="text"
                                    value={bonificacionRegistro}
                                />
                                {!validationError.bonificacionRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.bonificacionRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset
                                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
                            >
                                <label htmlFor="valorTRegistro">Valor Transporte</label>
                                <input
                                    id="valorTRegistro"
                                    name="valorTRegistro"
                                    onChange={(e) => setValorTRegistro(e.target.value)}
                                    placeholder="Ingresa el valor del transporte"
                                    type="text"
                                    value={valorTRegistro}
                                />
                                {!validationError.valorTRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.valorTRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset
                                className={Style.inventoryCreateRawMaterialRegisterMainEspecial}
                            >
                                <label htmlFor="observacionRegistro">Observación</label>
                                <input
                                    id="observacionRegistro"
                                    name="observacionRegistro"
                                    onChange={(e) => setObservacionRegistro(e.target.value)}
                                    placeholder="Ingresa una observación"
                                    type="text"
                                    value={observacionRegistro}
                                />
                                {!validationError.observacionRegistro ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={
                                            Style.inventoryCreateRawMaterialRegisterValidation
                                        }
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.observacionRegistro}
                                    </motion.span>
                                )}
                            </fieldset>
                        </div>
                    </main>
                    <footer className={Style.inventoryCreateRawMaterialRegisterFooter}>
                        <button
                            onClick={() => navigate("/inventory/registerrawmaterial")}
                            type="button"
                        >
                            Cancelar
                        </button>
                        <button type="submit">
                            {loading ? (
                                <div className={Style.loader}></div>
                            ) : (
                                "Crear Registro"
                            )}
                        </button>
                        {!serverError ? (
                            <></>
                        ) : (
                            <motion.span
                                className={
                                    Style.inventoryCreateRawMaterialRegisterValidationServer
                                }
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {serverError}
                            </motion.span>
                        )}
                    </footer>
                </motion.form>
            )}
        </>
    );
}

export default InventoryCreateAggregate;
