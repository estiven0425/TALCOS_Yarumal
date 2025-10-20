import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Style from "./styles/inventory-create-aggregate-form.module.css";

function InventoryCreateAggregate() {
  const [operador, setOperador] = useState([]);
  const [carguero, setCarguero] = useState([]);
  const [turno, setTurno] = useState([]);
  const [molinoAP, setMolinoAP] = useState([]);
  const [titularRegistroAp, setTitularRegistroAp] = useState("");
  const [fechaRegistroAp, setFechaRegistroAp] = useState("");
  const [turnoRegistroAp, setTurnoRegistroAp] = useState("");
  const [mesRegistroAp, setMesRegistroAp] = useState("");
  const [operadorRegistroAp, setOperadorRegistroAp] = useState("");
  const [ingresoRocaRegistroAp, setIngresoRocaRegistroAp] = useState("");
  const [bobCatRocaRegistroAp, setBobCatRocaRegistroAp] = useState("");
  const [ingresoGruesoRegistroAp, setIngresoGruesoRegistroAp] = useState("");
  const [bobCatGruesoRegistroAp, setBobCatGruesoRegistroAp] = useState("");
  const [pesoBobCatRegistroAp, setPesoBobCatRegistroAp] = useState("");
  const [totalRocaRegistroAp, setTotalRocaRegistroAp] = useState("");
  const [totalGruesoRegistroAp, setTotalGruesoRegistroAp] = useState("");
  const [molinoApRegistroAp, setMolinoApRegistroAp] = useState("");
  const [horometroInicioRegistroAp, setHorometroInicioRegistroAp] =
    useState("");
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
        // noinspection HttpUrlsUsage
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token: token,
        });

        setTitularRegistroAp(response.data.id_usuario);
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };

    void getUsuario();
  }, [localIP]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        // noinspection HttpUrlsUsage
        const [operadorRes, cargueroRes] = await Promise.all([
          axios.post(`http://${localIP}:3000/usuarios/informeinicialusuario`, {
            idPerfil: 6,
          }),
          axios.post(`http://${localIP}:3000/usuarios/informeinicialusuario`, {
            idPerfil: 8,
          }),
        ]);

        setOperador(operadorRes.data);
        setCarguero(cargueroRes.data);
      } catch (error) {
        console.error("Error al obtener usuarios por perfil:", error);
      }
    };

    void getUsers();
  }, [localIP]);

  useEffect(() => {
    const getItems = async () => {
      try {
        // noinspection HttpUrlsUsage
        const [turnoRes, molinoApRes] = await Promise.all([
          axios.get(`http://${localIP}:3000/turnos`),
          axios.get(`http://${localIP}:3000/molinos_ap`),
        ]);

        setTurno(turnoRes.data);
        setMolinoAP(molinoApRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    void getItems();
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

    if (!fechaRegistroAp) {
      errors.fechaRegistroAp = "La fecha del registro AP es obligatoria.";
    }
    if (!mesRegistroAp) {
      errors.mesRegistroAp = "El mes del registro AP es obligatorio.";
    } else if (!/^[0-9]+$/.test(mesRegistroAp)) {
      errors.mesRegistroAp =
        "El mes del registro AP deben ser un número válido.";
    }
    if (!turnoRegistroAp) {
      errors.turnoRegistroAp = "El turno del registro AP es obligatorio.";
    }
    if (!operadorRegistroAp) {
      errors.operadorRegisroAp =
        "El operador del molino AP del registro AP es obligatorio.";
    }
    if (!ingresoRocaRegistroAp) {
      errors.ingresoRocaRegistroAp =
        "El ingreso de roca del registro AP es obligatorio.";
    } else if (!/^\d+(\.\d+)?$/.test(ingresoRocaRegistroAp)) {
      errors.ingresoRocaRegistroAp =
        "El ingreso de roca del registro AP debe ser un número válido.";
    }
    if (!bobCatRocaRegistroAp) {
      errors.bobCatRocaRegistroAp =
        "Las cocadas del bob-cat de roca del registro AP es obligatoria.";
    } else if (!/^[0-9]+$/.test(bobCatRocaRegistroAp)) {
      errors.bobCatRocaRegistroAp =
        "Las cocadas del bob-cat de roca del registro AP deben ser un número válido.";
    }
    if (!ingresoGruesoRegistroAp) {
      errors.ingresoGruesoRegistroAp =
        "El ingreso de grueso del registro AP es obligatorio.";
    } else if (!/^\d+(\.\d+)?$/.test(ingresoGruesoRegistroAp)) {
      errors.ingresoGruesoRegistroAp =
        "El ingreso de grueso del registro AP debe ser un número válido.";
    }
    if (!bobCatGruesoRegistroAp) {
      errors.bobCatGruesoRegistroAp =
        "Las cocadas del bob-cat de grueso del registro AP es obligatoria.";
    } else if (!/^[0-9]+$/.test(bobCatGruesoRegistroAp)) {
      errors.bobCatGruesoRegistroAp =
        "Las cocadas del bob-cat de grueso del registro AP deben ser un número válido.";
    }
    if (!pesoBobCatRegistroAp) {
      errors.pesoBobCatRegistroAp =
        "El peso del bob-cat del registro AP es obligatorio.";
    } else if (!/^[0-9]+$/.test(pesoBobCatRegistroAp)) {
      errors.pesoBobCatRegistroAp =
        "El peso del bob-cat del registro AP debe ser un número válido.";
    }
    if (!totalRocaRegistroAp) {
      errors.totalRocaRegistroAp =
        "El total de roca del registro AP es obligatorio.";
    } else if (!/^\d+(\.\d+)?$/.test(totalRocaRegistroAp)) {
      errors.totalRocaRegistroAp =
        "El total de roca del registro AP debe ser un número válido.";
    }
    if (!totalGruesoRegistroAp) {
      errors.totalGruesoRegistroAp =
        "El total de grueso del registro AP es obligatorio.";
    } else if (!/^\d+(\.\d+)?$/.test(totalGruesoRegistroAp)) {
      errors.totalGruesoRegistroAp =
        "El total de grueso del registro AP debe ser un número válido.";
    }
    if (!molinoApRegistroAp) {
      errors.molinoApRegistroAp =
        "El molino AP del registro AP es obligatorio.";
    }
    if (!horometroInicioRegistroAp) {
      errors.horometroInicioRegistroAp =
        "El horómetro de inicio del molino AP del registro AP es obligatorio.";
    } else if (!/^[0-9]+$/.test(horometroInicioRegistroAp)) {
      errors.horometroInicioRegistroAp =
        "El horómetro de inicio del molino AP del registro AP debe ser un número válido.";
    }
    if (!horometroFinRegistroAp) {
      errors.horometroFinRegistroAp =
        "El horómetro de fin del molino AP del registro AP es obligatorio.";
    } else if (!/^[0-9]+$/.test(horometroFinRegistroAp)) {
      errors.horometroFinRegistroAp =
        "El horómetro de fin del molino AP del registro AP debe ser un número válido.";
    }
    if (!cargueroRegistroAp) {
      errors.cargueroRegistroAp =
        "El operador del minicargador del registro AP es obligatorio.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const sendCreateRegisterAP = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      // noinspection HttpUrlsUsage
      await axios.post(`http://${localIP}:3000/registros_ap`, {
        fecha_registro_ap: fechaRegistroAp,
        turno_registro_ap: turnoRegistroAp,
        mes_registro_ap: mesRegistroAp,
        titular_registro_ap: titularRegistroAp,
        operador_registro_ap: operadorRegistroAp,
        ingreso_roca_registro_ap: ingresoRocaRegistroAp,
        bobcat_roca_registro_ap: bobCatRocaRegistroAp,
        ingreso_grueso_registro_ap: ingresoGruesoRegistroAp,
        bobcat_grueso_registro_ap: bobCatGruesoRegistroAp,
        peso_bobcat_registro_ap: pesoBobCatRegistroAp,
        total_roca_registro_ap: totalRocaRegistroAp,
        total_grueso_registro_ap: totalGruesoRegistroAp,
        molino_registro_ap: molinoApRegistroAp,
        horometro_inicio_registro_ap: horometroInicioRegistroAp,
        horometro_fin_registro_ap: horometroFinRegistroAp,
        carguero_registro_ap: cargueroRegistroAp,
        observacion_registro_ap: observacionRegistroAp,
      });

      const total =
        parseFloat(totalRocaRegistroAp) + parseFloat(totalGruesoRegistroAp);

      // noinspection HttpUrlsUsage
      await axios.put(
        `http://${localIP}:3000/inventario_ap/actualizarcantidad`,
        {
          total_inventario_ap: total,
        },
      );

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          "Error al crear el registro AP. Por favor, inténtelo de nuevo.",
        );
        setLoading(false);
      }
    }
  };

  // noinspection JSValidateTypes
  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateAggregateRegisterApAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Registro AP creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateAggregateRegisterAp}
          onSubmit={sendCreateRegisterAP}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateAggregateRegisterApHeader}>
            <h1>Complete los datos para crear un nuevo registro AP</h1>
          </header>
          <main className={Style.inventoryCreateAggregateRegisterApMain}>
            <div>
              <fieldset>
                <label htmlFor="fechaRegistroAp">Fecha</label>
                <input
                  id="fechaRegistroAp"
                  name="fechaRegistroAp"
                  onChange={(e) => setFechaRegistroAp(e.target.value)}
                  placeholder="Ingresa la fecha del registro AP"
                  type="date"
                  value={fechaRegistroAp}
                />
                {!validationError.fechaRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.fechaRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="turnoRegistroAp">Turno</label>
                <select
                  id="turnoRegistroAp"
                  name="turnoRegistroAp"
                  onChange={(e) => setTurnoRegistroAp(e.target.value)}
                  value={turnoRegistroAp}
                >
                  <option value="" disabled>
                    Selecciona un turno
                  </option>
                  {turno.map((turno) => (
                    <option key={turno.id_turno} value={turno.nombre_turno}>
                      {turno.nombre_turno}
                    </option>
                  ))}
                </select>
                {!validationError.turnoRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.turnoRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="mesRegistroAp">Mes</label>
                <input
                  id="mesRegistroAp"
                  name="mesRegistroAp"
                  onChange={(e) => setMesRegistroAp(e.target.value)}
                  placeholder="Ingresa el número del mes del registro AP"
                  type="text"
                  value={mesRegistroAp}
                ></input>
                {!validationError.mesRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.mesRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="operadorRegistroAp">
                  Operador de molino AP
                </label>
                <select
                  id="operadorRegistroAp"
                  name="operadorRegistroAp"
                  onChange={(e) => setOperadorRegistroAp(e.target.value)}
                  value={operadorRegistroAp}
                >
                  <option value="" disabled>
                    Selecciona un operador de molino AP
                  </option>
                  {operador.map((operador) => (
                    <option
                      key={operador.id_usuario}
                      value={operador.id_usuario}
                    >
                      {operador.nombre_usuario}
                    </option>
                  ))}
                </select>
                {!validationError.operadorRegisroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.operadorRegisroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="ingresoRocaRegistroAp">Ingreso roca</label>
                <input
                  id="ingresoRocaRegistroAp"
                  name="ingresoRocaRegistroAp"
                  onChange={(e) => setIngresoRocaRegistroAp(e.target.value)}
                  placeholder="Ingresa la cantidad de roca ingresada en Kg"
                  type="text"
                  value={ingresoRocaRegistroAp}
                />
                {!validationError.ingresoRocaRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.ingresoRocaRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="bobCatRocaRegistroAp">Bob - Cat roca</label>
                <input
                  id="bobCatRocaRegistroAp"
                  name="bobCatRocaRegistroAp"
                  onChange={(e) => setBobCatRocaRegistroAp(e.target.value)}
                  placeholder="Ingresa la cantidad de cocadas del bob - cat ingresadas"
                  type="text"
                  value={bobCatRocaRegistroAp}
                />
                {!validationError.bobCatRocaRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.bobCatRocaRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="ingresoGruesoRegistroAp">Ingreso grueso</label>
                <input
                  id="ingresoGruesoRegistroAp"
                  name="ingresoGruesoRegistroAp"
                  onChange={(e) => setIngresoGruesoRegistroAp(e.target.value)}
                  placeholder="Ingresa la cantidad de grueso ingresada en Kg"
                  type="text"
                  value={ingresoGruesoRegistroAp}
                />
                {!validationError.ingresoGruesoRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.ingresoGruesoRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="bobCatGruesoRegistroAp">Bob - Cat grueso</label>
                <input
                  id="bobCatGruesoRegistroAp"
                  name="bobCatGruesoRegistroAp"
                  onChange={(e) => setBobCatGruesoRegistroAp(e.target.value)}
                  placeholder="Ingresa la cantidad de cocadas del bob - cat ingresadas"
                  type="text"
                  value={bobCatGruesoRegistroAp}
                />
                {!validationError.bobCatGruesoRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.bobCatGruesoRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="pesoBobCatRegistroAp">Peso Bob - Cat</label>
                <input
                  id="pesoBobCatRegistroAp"
                  name="pesoBobCatRegistroAp"
                  onChange={(e) => setPesoBobCatRegistroAp(e.target.value)}
                  placeholder="Ingresa el peso del Bob - Cat en Kg"
                  type="text"
                  value={pesoBobCatRegistroAp}
                />
                {!validationError.pesoBobCatRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.pesoBobCatRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="totalRocaRegistroAp">Total roca</label>
                <input
                  id="totalRocaRegistroAp"
                  name="totalRocaRegistroAp"
                  onChange={(e) => setTotalRocaRegistroAp(e.target.value)}
                  placeholder="Ingresa el total de roca en Kg"
                  type="text"
                  value={totalRocaRegistroAp}
                />
                {!validationError.totalRocaRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.totalRocaRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="totalGruesoRegistroAp">Total grueso</label>
                <input
                  id="totalGruesoRegistroAp"
                  name="totalGruesoRegistroAp"
                  onChange={(e) => setTotalGruesoRegistroAp(e.target.value)}
                  placeholder="Ingresa el total de grueso en Kg"
                  type="text"
                  value={totalGruesoRegistroAp}
                />
                {!validationError.totalGruesoRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.totalGruesoRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="molinoApRegistroAp">Molino AP</label>
                <select
                  id="molinoApRegistroAp"
                  name="molinoApRegistroAp"
                  onChange={(e) => setMolinoApRegistroAp(e.target.value)}
                  value={molinoApRegistroAp}
                >
                  <option value="" disabled>
                    Selecciona un molino AP
                  </option>
                  {molinoAP.map((molinoAP) => (
                    <option
                      key={molinoAP.id_molino_ap}
                      value={molinoAP.nombre_molino_ap}
                    >
                      {molinoAP.nombre_molino_ap}
                    </option>
                  ))}
                </select>
                {!validationError.molinoApRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.molinoApRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="horometroInicioRegistroAp">
                  Horómetro inicial
                </label>
                <input
                  id="horometroInicioRegistroAp"
                  name="horometroInicioRegistroAp"
                  onChange={(e) => setHorometroInicioRegistroAp(e.target.value)}
                  placeholder="Ingresa el horómetro inicial del molino AP"
                  type="text"
                  value={horometroInicioRegistroAp}
                />
                {!validationError.horometroInicioRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.horometroInicioRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset>
                <label htmlFor="horometroFinRegistroAp">Horómetro final</label>
                <input
                  id="horometroFinRegistroAp"
                  name="horometroFinRegistroAp"
                  onChange={(e) => setHorometroFinRegistroAp(e.target.value)}
                  placeholder="Ingresa el horómetro final del molino AP"
                  type="text"
                  value={horometroFinRegistroAp}
                />
                {!validationError.horometroFinRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.horometroFinRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="cargueroRegistroAp">
                  Operador de minicargador
                </label>
                <select
                  id="cargueroRegistroAp"
                  name="cargueroRegistroAp"
                  onChange={(e) => setCargueroRegistroAp(e.target.value)}
                  value={cargueroRegistroAp}
                >
                  <option value="" disabled>
                    Selecciona un operador de minicargador
                  </option>
                  {carguero.map((carguero) => (
                    <option
                      key={carguero.id_usuario}
                      value={carguero.id_usuario}
                    >
                      {carguero.nombre_usuario}
                    </option>
                  ))}
                </select>
                {!validationError.cargueroRegistroAp ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.inventoryCreateAggregateRegisterApValidation
                    }
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError.cargueroRegistroAp}
                  </motion.span>
                )}
              </fieldset>
              <fieldset
                className={Style.inventoryCreateAggregateRegisterApMainEspecial}
              >
                <label htmlFor="observacionRegistroAp">Observación</label>
                <input
                  id="observacionRegistroAp"
                  name="observacionRegistroAp"
                  onChange={(e) => setObservacionRegistroAp(e.target.value)}
                  placeholder="Ingresa una observación"
                  type="text"
                  value={observacionRegistroAp}
                />
              </fieldset>
            </div>
          </main>
          <footer className={Style.inventoryCreateAggregateRegisterApFooter}>
            <button
              onClick={() => navigate("/inventory/inventoryaggregate")}
              type="button"
            >
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear Registro AP"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryCreateAggregateRegisterApValidationServer
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
