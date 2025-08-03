import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "./styles/generate-novelty-windmill-power-on-form.module.css";

function GenerateNoveltyWindmillPowerOnForm() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [operador, setOperador] = useState([]);
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [bulto, setBulto] = useState([]);
  const [operadorNovedad, setOperadorNovedad] = useState("");
  const [molinoNovedad, setMolinoNovedad] = useState("");
  const [referenciaNovedad, setReferenciaNovedad] = useState("");
  const [bultoNovedad, setBultoNovedad] = useState("");
  const [horometroInicioParoNovedad, setHorometroInicioParoNovedad] =
    useState("");
  const [horometroFinParoNovedad, setHorometroFinParoNovedad] = useState("");
  const [observacionNovedad, setObservacionNovedad] = useState("");
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
        navigate("/generatereport/noveltyoption");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);

  useEffect(() => {
    const getData = async () => {
      try {
        // noinspection HttpUrlsUsage
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;

        // noinspection HttpUrlsUsage
        const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShifts.data;

        const currentTime = new Date();

        const getShiftForDate = (shifts, now) => {
          const compareTime = (hour, start, end) => {
            const [startHour, startMinute] = start.split(":").map(Number);
            const [endHour, endMinute] = end.split(":").map(Number);

            const startTimeMs = (startHour * 60 + startMinute) * 60000;
            const endTimeMs = (endHour * 60 + endMinute) * 60000;
            const currentTimeMs =
              (hour.getHours() * 60 + hour.getMinutes()) * 60000;

            const isInShift =
              endTimeMs > startTimeMs
                ? currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs
                : currentTimeMs >= startTimeMs || currentTimeMs < endTimeMs;

            return {
              isInShift,
              crossesMidnight: endTimeMs <= startTimeMs,
              startTimeMs,
              endTimeMs,
              currentTimeMs,
            };
          };

          for (const shift of shifts) {
            const { isInShift, crossesMidnight, currentTimeMs, startTimeMs } =
              compareTime(now, shift.inicio_turno, shift.fin_turno);

            if (shift.inicio_turno > shift.fin_turno) {
              if (isInShift) {
                const fechaTurno = new Date(now);

                if (crossesMidnight && currentTimeMs < startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() - 1);
                } else fechaTurno.setDate(fechaTurno.getDate() - 1);

                return { shift, fechaTurno };
              }
            } else {
              if (isInShift) {
                const fechaTurno = new Date(now);

                if (crossesMidnight && currentTimeMs < startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() - 1);
                } else fechaTurno.setDate(fechaTurno.getDate() - 1);

                if (currentTimeMs > startTimeMs) {
                  fechaTurno.setDate(fechaTurno.getDate() + 1);
                }

                return { shift, fechaTurno };
              }
            }
          }

          return { shift: null, fechaTurno: null };
        };

        const { shift: currentShift, fechaTurno } = getShiftForDate(
          shifts,
          currentTime,
        );

        if (!currentShift) {
          console.warn("No se encontró turno actual.");
          return;
        }

        // noinspection HttpUrlsUsage
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          },
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;

        const isAvailable = (report, allNovelties) => {
          if (!report?.molino_informe_inicial) {
            const turnOnNovelty = allNovelties.find(
              (nov) => nov.tipo_novedad === "Encendido de molino",
            );

            if (!turnOnNovelty) {
              return true;
            }
            if (turnOnNovelty) {
              return false;
            }
          }
          return false;
        };

        const combinedData = mills.map((molino) => {
          const report = reports.find(
            (report) => report.molino_informe_inicial === molino.nombre_molino,
          );

          const millNovelties = news.filter(
            (novelty) => novelty.molino_novedad === molino.nombre_molino,
          );

          const available = isAvailable(report, millNovelties);

          return {
            name: molino.nombre_molino,
            available,
          };
        });

        setCurrentData(reports);
        setFinalData(endReports);
        setMolino(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP]);

  useEffect(() => {
    const getItems = async () => {
      try {
        // noinspection HttpUrlsUsage
        const [referenciaRes, bultoRes] = await Promise.all([
          axios.get(`http://${localIP}:3000/referencias`),
          axios.get(`http://${localIP}:3000/bultos`),
        ]);

        setReferencia(referenciaRes.data);
        setBulto(bultoRes.data);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    void getItems();
  }, [localIP]);

  useEffect(() => {
    const getUser = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.post(
          `http://${localIP}:3000/usuarios/informeinicialusuario`,
          { idPerfil: 6 },
        );

        setOperador(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };
    void getUser();
  }, [localIP]);

  const validation = () => {
    const errors = {};

    if (!molinoNovedad) {
      errors.molinoNovedad = "El molino es obligatorio.";
    }
    if (!operadorNovedad) {
      errors.operadorNovedad = "El operador del molino es obligatorio.";
    }
    if (!referenciaNovedad) {
      errors.referenciaNovedad = "La referencia del molino es obligatoria.";
    }
    if (!bultoNovedad) {
      errors.bultoNovedad = "El bulto del molino es obligatorio.";
    }
    if (!horometroFinParoNovedad.trim()) {
      errors.horometroFinParoNovedad =
        "El horómetro del molino es obligatorio.";
    }
    // noinspection JSCheckFunctionSignatures
    if (horometroFinParoNovedad && isNaN(horometroFinParoNovedad)) {
      errors.horometroFinParoNovedad =
        "El horómetro del molino debe ser un número.";
    }

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };

  const determinateShift = (data) => {
    if (!data || data.length === 0) return null;

    const turnoCounts = data.reduce((acc, item) => {
      const turno = item.turno_informe_inicial;

      acc[turno] = (acc[turno] || 0) + 1;

      return acc;
    }, {});

    // noinspection UnnecessaryLocalVariableJS
    const mostFrequentTurno = Object.keys(turnoCounts).reduce((a, b) =>
      turnoCounts[a] > turnoCounts[b] ? a : b,
    );

    return mostFrequentTurno;
  };

  const determinateDate = (data) => {
    if (!data || data.length === 0) return null;

    const dateCounts = data.reduce((acc, item) => {
      const date = item.fecha_informe_inicial;

      acc[date] = (acc[date] || 0) + 1;

      return acc;
    }, {});

    // noinspection UnnecessaryLocalVariableJS
    const mostFrequentDate = Object.keys(dateCounts).reduce((a, b) =>
      dateCounts[a] > dateCounts[b] ? a : b,
    );

    return mostFrequentDate;
  };

  const sendCreate = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    const horaNovedad = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });

    const fechaNovedad = determinateDate(currentData);
    const shiftNovelty = determinateShift(currentData);

    let date = new Date();

    if (date.getHours() >= 22  && date.getHours() <= 23) {
      date.setDate(date.getDate() - 1);
    }

    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        fecha_auxiliar_novedad: date.toISOString().split("T")[0],
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Encendido de molino",
        molino_novedad: molinoNovedad,
        referencia_novedad: referenciaNovedad,
        bulto_novedad: bultoNovedad,
        horometro_inicio_paro_novedad: horometroInicioParoNovedad,
        horometro_fin_paro_novedad: horometroFinParoNovedad,
        operador_novedad: operadorNovedad,
        observacion_novedad: observacionNovedad,
      },
    ];

    try {
      // noinspection HttpUrlsUsage
      await axios.post(`http://${localIP}:3000/novedades`, novedad);

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          `Error al encender el molino. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/noveltyoption");
  };

  // noinspection JSUnresolvedReference,JSValidateTypes
  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyWindmillPowerOnFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>El informe del turno ya ha finalizado</h1>
        </motion.div>
      ) : (
        <>
          {loadingAlternative ? (
            <motion.div
              className={Style.generateNoveltyWindmillPowerOnFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : sendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyWindmillPowerOnFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Molino encendido con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyWindmillPowerOnForm}
              onSubmit={sendCreate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header
                className={Style.generateNoveltyWindmillPowerOnFormHeader}
              >
                <h1>Complete los datos para encender el molino</h1>
              </header>
              <main className={Style.generateNoveltyWindmillPowerOnFormMain}>
                <fieldset
                  className={
                    Style.generateNoveltyWindmillPowerOnFormMainEspecial
                  }
                >
                  <label htmlFor="molinoNovedad">Seleccione un molino</label>
                  <select
                    id="molinoNovedad"
                    name="molinoNovedad"
                    value={molinoNovedad}
                    onChange={(e) => setMolinoNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un molino
                    </option>
                    {molino
                      .filter((item) => item.available)
                      .map((item, index) => (
                        <option key={index} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  {!validationError.molinoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.generateNoveltyWindmillPowerOnFormValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.molinoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={
                    Style.generateNoveltyWindmillPowerOnFormMainEspecial
                  }
                >
                  <label htmlFor="operadorNovedad">Operador de molino</label>
                  <select
                    id="operadorNovedad"
                    name="operadorNovedad"
                    value={operadorNovedad}
                    onChange={(e) => setOperadorNovedad(e.target.value)}
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
                  {!validationError.operadorNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.generateNoveltyWindmillPowerOnFormValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.operadorNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor="referenciaNovedad">Referencia</label>
                  <select
                    id="referenciaNovedad"
                    name="referenciaNovedad"
                    value={referenciaNovedad}
                    onChange={(e) => setReferenciaNovedad(e.target.value)}
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
                  {!validationError.referenciaNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.generateNoveltyWindmillPowerOnFormValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.referenciaNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset>
                  <label htmlFor="bultoNovedad">Bulto</label>
                  <select
                    id="bultoNovedad"
                    name="bultoNovedad"
                    value={bultoNovedad}
                    onChange={(e) => setBultoNovedad(e.target.value)}
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
                  {!validationError.bultoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={
                        Style.generateNoveltyWindmillPowerOnFormValidation
                      }
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.bultoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={
                    Style.generateNoveltyWindmillPowerOnFormMainEspecial
                  }
                >
                  <label htmlFor="horometroFinParoNovedad">Horómetro</label>
                  <input
                    id="horometroFinParoNovedad"
                    name="horometroFinParoNovedad"
                    type="text"
                    value={horometroFinParoNovedad}
                    onChange={(e) => {
                      const value = e.target.value;
                      setHorometroInicioParoNovedad(value);
                      setHorometroFinParoNovedad(value);
                    }}
                    placeholder="Ingrese el horómetro del molino"
                  />
                  {!validationError.horometroFinParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStartFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.horometroFinParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
                <fieldset
                  className={
                    Style.generateNoveltyWindmillPowerOnFormMainEspecial
                  }
                >
                  <label htmlFor="observacionNovedad">Observación</label>
                  <input
                    id="observacionNovedad"
                    name="observacionNovedad"
                    type="text"
                    value={observacionNovedad}
                    onChange={(e) => setObservacionNovedad(e.target.value)}
                    placeholder="Ingresa una observación"
                  />
                </fieldset>
              </main>
              <footer
                className={Style.generateNoveltyWindmillPowerOnFormFooter}
              >
                <button onClick={() => redirectGenerateReport()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Encender molino"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyWindmillPowerOnFormValidationServer
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
          ) : (
            <motion.div
              className={Style.generateNoveltyWindmillPowerOnFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>El informe inicial del turno no ha sido creado</h1>
            </motion.div>
          )}
        </>
      )}
    </>
  );
}

export default GenerateNoveltyWindmillPowerOnForm;
