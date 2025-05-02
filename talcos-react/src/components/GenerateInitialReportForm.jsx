import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-initial-report-form.module.css";

function GenerateInitialReportForm() {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [controlCalidad, setControlCalidad] = useState([]);
  const [mecanico, setMecanico] = useState([]);
  const [operador, setOperador] = useState([]);
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [bulto, setBulto] = useState([]);
  const [carguero, setCarguero] = useState([]);
  const [bobCat, setBobCat] = useState([]);
  const [titularInformeInicial, setTitularInformeInicial] = useState("");
  const [controlCalidadInformeInicial, setControlCalidadInformeInicial] =
    useState([]);
  const [mecanicoInformeInicial, setMecanicoInformeInicial] = useState([]);
  const [operadorInformeInicial, setOperadorInformeInicial] = useState([]);
  const [molinoInformeInicial, setMolinoInformeInicial] = useState([]);
  const [referenciaInformeInicial, setReferenciaInformeInicial] = useState([]);
  const [bultoInformeInicial, setBultoInformeInicial] = useState([]);
  const [horometroInformeInicial, setHorometroInformeInicial] = useState([]);
  const [cargueroInformeInicial, setCargueroInformeInicial] = useState([]);
  const [bobCatInformeInicial, setBobCatInformeInicial] = useState([]);
  const [observacionInformeInicial, setObservacionInformeInicial] =
    useState("");
  const [selectedControlCalidad, setSelectedControlCalidad] = useState("");
  const [selectedMecanico, setSelectedMecanico] = useState("");
  const [molinoEnabled, setMolinoEnabled] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const [sendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/generatereportmenu");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const getUsuario = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token: token,
        });

        setTitularInformeInicial(response.data.id_usuario);
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };
    getUsuario();
  }, [localIP]);
  useEffect(() => {
    const getShifts = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = response.data;
        const currentTime = new Date();

        const compareTime = (hour, start, end) => {
          const [startTime, startMinute] = start.split(":").map(Number);
          const [endTime, endMinute] = end.split(":").map(Number);
          const startTimeMs = (startTime * 60 + startMinute) * 60000;
          const endTimeMs = (endTime * 60 + endMinute) * 60000;
          const currentTimeMs =
            (hour.getHours() * 60 + hour.getMinutes()) * 60000;

          if (endTimeMs > startTimeMs) {
            return currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs;
          } else {
            return currentTimeMs >= startTimeMs || currentTimeMs < endTimeMs;
          }
        };

        const currentShift = shifts.find((shift) =>
          compareTime(currentTime, shift.inicio_turno, shift.fin_turno)
        );

        const currentDate = currentTime.toISOString().split("T")[0];
        const {
          nombre_turno: turno,
          inicio_turno: inicioTurno,
          fin_turno: finTurno,
        } = currentShift;
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );
        const reports = responseStartReport.data;

        currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
        currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);

        setCurrentData(reports);
        setCurrentShift(currentShift);
      } catch (error) {
        console.error("Error al obtener el turno:", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    getShifts();
  }, [localIP]);
  useEffect(() => {
    const getItems = async () => {
      try {
        const [bobCatRes, molinoRes, referenciaRes, bultoRes] =
          await Promise.all([
            axios.get(`http://${localIP}:3000/bob_cats`),
            axios.get(`http://${localIP}:3000/molinos`),
            axios.get(`http://${localIP}:3000/referencias`),
            axios.get(`http://${localIP}:3000/bultos`),
          ]);

        setBobCat(bobCatRes.data);
        setMolino(molinoRes.data);
        setReferencia(referenciaRes.data);
        setBulto(bultoRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    getItems();
  }, [localIP]);
  useEffect(() => {
    const getUsers = async () => {
      try {
        const [controlCalidadRes, mecanicoRes, operadorRes, cargueroRes] =
          await Promise.all([
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 4 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 7 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 6 }
            ),
            axios.post(
              `http://${localIP}:3000/usuarios/informeinicialusuario`,
              { idPerfil: 8 }
            ),
          ]);

        setControlCalidad(controlCalidadRes.data);
        setMecanico(mecanicoRes.data);
        setOperador(operadorRes.data);
        setCarguero(cargueroRes.data);
      } catch (error) {
        console.error("Error al obtener usuarios por perfil:", error);
      }
    };

    getUsers();
  }, [localIP]);
  useEffect(() => {
    setMolinoInformeInicial(
      molino.map((molinoItem) => molinoItem.nombre_molino)
    );
  }, [molino]);
  useEffect(() => {
    setBobCatInformeInicial(
      bobCat.map((bobCatItem) => bobCatItem.nombre_bob_cat)
    );
  }, [bobCat]);
  useEffect(() => {
    setOperadorInformeInicial(new Array(molino.length).fill(""));
    setReferenciaInformeInicial(new Array(molino.length).fill(""));
    setBultoInformeInicial(new Array(molino.length).fill(""));
    setHorometroInformeInicial(new Array(molino.length).fill(""));
  }, [molino]);
  useEffect(() => {
    setCargueroInformeInicial(new Array(bobCat.length).fill(""));
  }, [bobCat]);
  useEffect(() => {
    setMolinoEnabled(new Array(molino.length).fill(true));
  }, [molino]);

  const addQualityControl = (id_usuario, nombre_usuario) => {
    setControlCalidadInformeInicial((prev) => [
      ...prev,
      { id_usuario, nombre_usuario },
    ]);
  };
  const removeQualityControl = (index) => {
    setControlCalidadInformeInicial((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };
  const addMechanic = (id_usuario, nombre_usuario) => {
    setMecanicoInformeInicial((prev) => [
      ...prev,
      { id_usuario, nombre_usuario },
    ]);
  };
  const removeMechanic = (index) => {
    setMecanicoInformeInicial((prev) => prev.filter((_, i) => i !== index));
  };
  const handleOperadorChange = (index, value) => {
    setOperadorInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleReferenciaChange = (index, value) => {
    setReferenciaInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleBultoChange = (index, value) => {
    setBultoInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleHorometroChange = (index, value) => {
    setHorometroInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleCargueroChange = (index, value) => {
    setCargueroInformeInicial((prev) => {
      const updated = [...prev];

      updated[index] = value;

      return updated;
    });
  };
  const handleMolinoToggle = (index) => {
    setMolinoEnabled((prev) => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };
  const validation = () => {
    const errors = {};

    if (!controlCalidadInformeInicial.length) {
      errors.controlCalidadInformeInicial =
        "El control de calidad del informe es obligatorio.";
    }
    if (!mecanicoInformeInicial.length) {
      errors.mecanicoInformeInicial = "El mecánico del informe es obligatorio.";
    }

    const molinoErrors = molino.map((molinoItem, index) => {
      if (!molinoEnabled[index]) return null;

      const molinoError = {};

      if (!operadorInformeInicial[index]?.trim()) {
        molinoError.operador = `El operador del ${molinoItem.nombre_molino} es obligatorio.`;
      }
      if (!referenciaInformeInicial[index]?.trim()) {
        molinoError.referencia = `La referencia del ${molinoItem.nombre_molino} es obligatoria.`;
      }
      if (!bultoInformeInicial[index]?.trim()) {
        molinoError.bulto = `El bulto del ${molinoItem.nombre_molino} es obligatorio.`;
      }
      if (
        !horometroInformeInicial[index]?.trim() ||
        !/^[0-9.,]+$/.test(horometroInformeInicial[index]) ||
        parseFloat(horometroInformeInicial[index]) < 0
      ) {
        molinoError.horometro = `El horómetro del ${molinoItem.nombre_molino} debe ser un número válido y mayor o igual a 0.`;
      }

      return Object.keys(molinoError).length > 0 ? molinoError : null;
    });

    if (molinoErrors.some((error) => error)) {
      errors.molino = molinoErrors;
    }
    const cargueroErrors = cargueroInformeInicial.map((carguero, index) =>
      !carguero
        ? `El operador del ${bobCat[index].nombre_bob_cat} es obligatorio.`
        : null
    );

    if (cargueroErrors.some((error) => error)) {
      errors.cargueroInformeInicial = cargueroErrors;
    }

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };

  const sendCreate = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    const fechaInformeInicial = new Date().toISOString().split("T")[0];
    const horaInformeInicial = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    const persistentData = {
      titular_informe_inicial: titularInformeInicial,
      fecha_informe_inicial: fechaInformeInicial,
      hora_informe_inicial: horaInformeInicial,
      turno_informe_inicial: currentShift.nombre_turno,
      observacion_informe_inicial: observacionInformeInicial,
    };
    const controlCalidadObjects = controlCalidadInformeInicial.map(
      (control) => ({
        ...persistentData,
        cdc_informe_inicial: control.id_usuario,
      })
    );
    const mecanicoObjects = mecanicoInformeInicial.map((mecanico) => ({
      ...persistentData,
      mecanico_informe_inicial: mecanico.id_usuario,
    }));
    const molinoObjects = molinoInformeInicial
      .map((_, index) => {
        if (!molinoEnabled[index]) return null;

        return {
          ...persistentData,
          operador_informe_inicial: operadorInformeInicial[index],
          molino_informe_inicial: molinoInformeInicial[index],
          referencia_informe_inicial: referenciaInformeInicial[index],
          bulto_informe_inicial: bultoInformeInicial[index],
          horometro_informe_inicial: horometroInformeInicial[index],
        };
      })
      .filter((molino) => molino !== null);

    const bobCatObjects = bobCatInformeInicial.map((_, index) => ({
      ...persistentData,
      carguero_informe_inicial: cargueroInformeInicial[index],
      bob_cat_informe_inicial: bobCatInformeInicial[index],
    }));
    const fullReport = [
      ...controlCalidadObjects,
      ...mecanicoObjects,
      ...molinoObjects,
      ...bobCatObjects,
    ];

    try {
      await axios.post(`http://${localIP}:3000/informes_iniciales`, fullReport);

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al crear el informe inicial. Por favor, inténtelo de nuevo.`
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/generatereportmenu");
  };

  return (
    <>
      {loadingAlternative ? (
        <motion.div
          className={Style.generateInitialReportFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.div>
      ) : sendStatus === true ? (
        <motion.div
          className={Style.generateInitialReportFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Informe inicial creado con éxito</h1>
        </motion.div>
      ) : currentData.length === 0 ? (
        <motion.form
          className={Style.generateInitialReportForm}
          onSubmit={sendCreate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.generateInitialReportFormHeader}>
            <h1>Complete los datos para crear el informe inicial</h1>
          </header>
          <main className={Style.generateInitialReportFormMain}>
            <fieldset className={Style.generateInitialReportFormMainPrimary}>
              <label htmlFor="controlcalidad">Control de calidad</label>
              <select
                id="controlcalidad"
                name="controlcalidad"
                value={selectedControlCalidad}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addQualityControl(e.target.value, selectedOption.text);
                  setSelectedControlCalidad("");
                }}
              >
                <option value="" disabled>
                  Añade un usuario de control de calidad
                </option>
                {controlCalidad.map((cdc) => (
                  <option key={cdc.id_usuario} value={cdc.id_usuario}>
                    {cdc.nombre_usuario}
                  </option>
                ))}
              </select>
              {!validationError.controlCalidadInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.controlCalidadInformeInicial}
                </motion.span>
              )}
              <ul>
                {controlCalidadInformeInicial.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.nombre_usuario}{" "}
                    <button
                      type="button"
                      onClick={() => removeQualityControl(index)}
                    >
                      Eliminar
                    </button>
                  </motion.li>
                ))}
              </ul>
            </fieldset>
            <fieldset className={Style.generateInitialReportFormMainPrimary}>
              <label htmlFor="mecanico">Mecánico</label>
              <select
                id="mecanico"
                name="mecanico"
                value={selectedMecanico}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addMechanic(e.target.value, selectedOption.text);
                  setSelectedMecanico("");
                }}
              >
                <option value="" disabled>
                  Añade un usuario de mecánico
                </option>
                {mecanico.map((mecanico) => (
                  <option key={mecanico.id_usuario} value={mecanico.id_usuario}>
                    {mecanico.nombre_usuario}
                  </option>
                ))}
              </select>
              {!validationError.mecanicoInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.mecanicoInformeInicial}
                </motion.span>
              )}
              <ul>
                {mecanicoInformeInicial.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.nombre_usuario}{" "}
                    <button type="button" onClick={() => removeMechanic(index)}>
                      Eliminar
                    </button>
                  </motion.li>
                ))}
              </ul>
            </fieldset>
            {molino.map((molinoItem, index) => (
              <fieldset
                className={Style.generateInitialReportFormMainSecondary}
                key={index}
              >
                <div
                  className={
                    Style.generateInitialReportFormMainEspecialAlternative
                  }
                >
                  <h2>{molinoItem.nombre_molino}</h2>
                  <div>
                    <label>
                      Habilitar molino
                      <input
                        checked={molinoEnabled[index]}
                        onChange={() => handleMolinoToggle(index)}
                        type="checkbox"
                      />
                    </label>
                  </div>
                </div>
                <div className={Style.generateInitialReportFormMainEspecial}>
                  <label htmlFor={`operador-${index}`}>
                    Operador de molino
                  </label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`operador-${index}`}
                    name={`operador-${index}`}
                    onChange={(e) =>
                      handleOperadorChange(index, e.target.value)
                    }
                    value={operadorInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione un operador de molino
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
                  {validationError.molino &&
                    validationError.molino[index]?.operador && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].operador}
                      </motion.span>
                    )}
                </div>
                <div>
                  <label htmlFor={`referencia-${index}`}>Referencia</label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`referencia-${index}`}
                    name={`referencia-${index}`}
                    onChange={(e) =>
                      handleReferenciaChange(index, e.target.value)
                    }
                    value={referenciaInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione una referencia
                    </option>
                    {referencia.map((referencia) => (
                      <option
                        key={referencia.id_referencia}
                        value={referencia.nombre_referencia}
                      >
                        {referencia.nombre_referencia}
                      </option>
                    ))}
                  </select>
                  {validationError.molino &&
                    validationError.molino[index]?.referencia && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].referencia}
                      </motion.span>
                    )}
                </div>
                <div>
                  <label htmlFor={`bulto-${index}`}>Bulto</label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`bulto-${index}`}
                    name={`bulto-${index}`}
                    onChange={(e) => handleBultoChange(index, e.target.value)}
                    value={bultoInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione un bulto
                    </option>
                    {bulto.map((bulto) => (
                      <option key={bulto.id_bulto} value={bulto.nombre_bulto}>
                        {bulto.nombre_bulto}
                      </option>
                    ))}
                  </select>
                  {validationError.molino &&
                    validationError.molino[index]?.bulto && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].bulto}
                      </motion.span>
                    )}
                </div>
                <div className={Style.generateInitialReportFormMainEspecial}>
                  <label htmlFor={`horometro-${index}`}>Horómetro</label>
                  <input
                    disabled={!molinoEnabled[index]}
                    id={`horometro-${index}`}
                    name={`horometro-${index}`}
                    onChange={(e) =>
                      handleHorometroChange(index, e.target.value)
                    }
                    placeholder="Ingresa el horómetro del molino"
                    type="text"
                    value={horometroInformeInicial[index] || ""}
                  />
                  {validationError.molino &&
                    validationError.molino[index]?.horometro && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].horometro}
                      </motion.span>
                    )}
                </div>
              </fieldset>
            ))}
            {bobCat.map((bobCatItem, index) => (
              <fieldset
                key={index}
                className={Style.generateInitialReportFormMainThird}
              >
                <h2>{bobCatItem.nombre_bob_cat}</h2>

                <label htmlFor={`carguero-${index}`}>
                  Operador de minicargador
                </label>
                <select
                  id={`carguero-${index}`}
                  name={`carguero-${index}`}
                  onChange={(e) => handleCargueroChange(index, e.target.value)}
                  value={cargueroInformeInicial[index] || ""}
                >
                  <option value="" disabled>
                    Seleccione un operador de minicargador
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
                {validationError.cargueroInformeInicial &&
                  validationError.cargueroInformeInicial[index] && (
                    <motion.span
                      className={Style.generateInitialReportFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.cargueroInformeInicial[index]}
                    </motion.span>
                  )}
              </fieldset>
            ))}
            <fieldset className={Style.generateInitialReportFormMainFourth}>
              <label htmlFor="observacion">Observación</label>
              <input
                id="observacion"
                name="observacion"
                onChange={(e) => setObservacionInformeInicial(e.target.value)}
                placeholder="Ingresa una observación"
                type="text"
                value={observacionInformeInicial}
              />
              {!validationError.observacionInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.observacionInformeInicial}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.generateInitialReportFormFooter}>
            <button onClick={() => redirectGenerateReport()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear Informe inicial"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.generateInitialReportFormValidationServer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.form>
      ) : (
        <motion.form
          className={Style.generateInitialReportForm}
          onSubmit={sendCreate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.generateInitialReportFormHeader}>
            <h1>Complete los datos para crear el informe inicial</h1>
          </header>
          <main className={Style.generateInitialReportFormMain}>
            <fieldset className={Style.generateInitialReportFormMainPrimary}>
              <label htmlFor="controlcalidad">Control de calidad</label>
              <select
                id="controlcalidad"
                name="controlcalidad"
                value={selectedControlCalidad}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addQualityControl(e.target.value, selectedOption.text);
                  setSelectedControlCalidad("");
                }}
              >
                <option value="" disabled>
                  Añade un usuario de control de calidad
                </option>
                {controlCalidad.map((cdc) => (
                  <option key={cdc.id_usuario} value={cdc.id_usuario}>
                    {cdc.nombre_usuario}
                  </option>
                ))}
              </select>
              {!validationError.controlCalidadInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.controlCalidadInformeInicial}
                </motion.span>
              )}
              <ul>
                {controlCalidadInformeInicial.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.nombre_usuario}{" "}
                    <button
                      type="button"
                      onClick={() => removeQualityControl(index)}
                    >
                      Eliminar
                    </button>
                  </motion.li>
                ))}
              </ul>
            </fieldset>
            <fieldset className={Style.generateInitialReportFormMainPrimary}>
              <label htmlFor="mecanico">Mecánico</label>
              <select
                id="mecanico"
                name="mecanico"
                value={selectedMecanico}
                onChange={(e) => {
                  const selectedOption =
                    e.target.options[e.target.selectedIndex];
                  addMechanic(e.target.value, selectedOption.text);
                  setSelectedMecanico("");
                }}
              >
                <option value="" disabled>
                  Añade un usuario de mecánico
                </option>
                {mecanico.map((mecanico) => (
                  <option key={mecanico.id_usuario} value={mecanico.id_usuario}>
                    {mecanico.nombre_usuario}
                  </option>
                ))}
              </select>
              {!validationError.mecanicoInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.mecanicoInformeInicial}
                </motion.span>
              )}
              <ul>
                {mecanicoInformeInicial.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {item.nombre_usuario}{" "}
                    <button type="button" onClick={() => removeMechanic(index)}>
                      Eliminar
                    </button>
                  </motion.li>
                ))}
              </ul>
            </fieldset>
            {molino.map((molinoItem, index) => (
              <fieldset
                className={Style.generateInitialReportFormMainSecondary}
                key={index}
              >
                <div
                  className={
                    Style.generateInitialReportFormMainEspecialAlternative
                  }
                >
                  <h2>{molinoItem.nombre_molino}</h2>
                  <div>
                    <label>
                      Habilitar molino
                      <input
                        checked={molinoEnabled[index]}
                        onChange={() => handleMolinoToggle(index)}
                        type="checkbox"
                      />
                    </label>
                  </div>
                </div>
                <div className={Style.generateInitialReportFormMainEspecial}>
                  <label htmlFor={`operador-${index}`}>
                    Operador de molino
                  </label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`operador-${index}`}
                    name={`operador-${index}`}
                    onChange={(e) =>
                      handleOperadorChange(index, e.target.value)
                    }
                    value={operadorInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione un operador de molino
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
                  {validationError.molino &&
                    validationError.molino[index]?.operador && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].operador}
                      </motion.span>
                    )}
                </div>
                <div>
                  <label htmlFor={`referencia-${index}`}>Referencia</label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`referencia-${index}`}
                    name={`referencia-${index}`}
                    onChange={(e) =>
                      handleReferenciaChange(index, e.target.value)
                    }
                    value={referenciaInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione una referencia
                    </option>
                    {referencia.map((referencia) => (
                      <option
                        key={referencia.id_referencia}
                        value={referencia.nombre_referencia}
                      >
                        {referencia.nombre_referencia}
                      </option>
                    ))}
                  </select>
                  {validationError.molino &&
                    validationError.molino[index]?.referencia && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].referencia}
                      </motion.span>
                    )}
                </div>
                <div>
                  <label htmlFor={`bulto-${index}`}>Bulto</label>
                  <select
                    disabled={!molinoEnabled[index]}
                    id={`bulto-${index}`}
                    name={`bulto-${index}`}
                    onChange={(e) => handleBultoChange(index, e.target.value)}
                    value={bultoInformeInicial[index] || ""}
                  >
                    <option value="" disabled>
                      Seleccione un bulto
                    </option>
                    {bulto.map((bulto) => (
                      <option key={bulto.id_bulto} value={bulto.nombre_bulto}>
                        {bulto.nombre_bulto}
                      </option>
                    ))}
                  </select>
                  {validationError.molino &&
                    validationError.molino[index]?.bulto && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].bulto}
                      </motion.span>
                    )}
                </div>
                <div className={Style.generateInitialReportFormMainEspecial}>
                  <label htmlFor={`horometro-${index}`}>Horómetro</label>
                  <input
                    disabled={!molinoEnabled[index]}
                    id={`horometro-${index}`}
                    name={`horometro-${index}`}
                    onChange={(e) =>
                      handleHorometroChange(index, e.target.value)
                    }
                    placeholder="Ingresa el horómetro del molino"
                    type="text"
                    value={horometroInformeInicial[index] || ""}
                  />
                  {validationError.molino &&
                    validationError.molino[index]?.horometro && (
                      <motion.span
                        className={Style.generateInitialReportFormValidation}
                        initial={{ zoom: 0 }}
                        animate={{ zoom: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {validationError.molino[index].horometro}
                      </motion.span>
                    )}
                </div>
              </fieldset>
            ))}
            {bobCat.map((bobCatItem, index) => (
              <fieldset
                key={index}
                className={Style.generateInitialReportFormMainThird}
              >
                <h2>{bobCatItem.nombre_bob_cat}</h2>

                <label htmlFor={`carguero-${index}`}>
                  Operador de minicargador
                </label>
                <select
                  id={`carguero-${index}`}
                  name={`carguero-${index}`}
                  onChange={(e) => handleCargueroChange(index, e.target.value)}
                  value={cargueroInformeInicial[index] || ""}
                >
                  <option value="" disabled>
                    Seleccione un operador de minicargador
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
                {validationError.cargueroInformeInicial &&
                  validationError.cargueroInformeInicial[index] && (
                    <motion.span
                      className={Style.generateInitialReportFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.cargueroInformeInicial[index]}
                    </motion.span>
                  )}
              </fieldset>
            ))}
            <fieldset className={Style.generateInitialReportFormMainFourth}>
              <label htmlFor="observacion">Observación</label>
              <input
                id="observacion"
                name="observacion"
                onChange={(e) => setObservacionInformeInicial(e.target.value)}
                placeholder="Ingresa una observación"
                type="text"
                value={observacionInformeInicial}
              />
              {!validationError.observacionInformeInicial ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateInitialReportFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.observacionInformeInicial}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.generateInitialReportFormFooter}>
            <button onClick={() => redirectGenerateReport()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear Informe inicial"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.generateInitialReportFormValidationServer}
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

export default GenerateInitialReportForm;
