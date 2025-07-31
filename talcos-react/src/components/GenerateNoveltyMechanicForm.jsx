import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-component-form.module.css";

function GenerateNoveltyMechanicForm() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [currentMechanic, setCurrentMechanic] = useState([]);
  const [mecanicoNovedad, setMecanicoNovedad] = useState("");
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
        const responseMechanic = await axios.post(
          `http://${localIP}:3000/usuarios/informeinicialusuario`,
          { idPerfil: 7 },
        );
        const mechanics = responseMechanic.data;

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

        const usedMechanicIds = new Set([
          ...reports
            .filter((reports) => reports.mecanico_informe_inicial !== null)
            .map((reports) => reports.mecanico_informe_inicial),
          ...news
            .filter((news) => news.mecanico_novedad !== null)
            .map((news) => news.mecanico_novedad),
        ]);

        const availableMechanics = mechanics.filter(
          (mecanico) => !usedMechanicIds.has(mecanico.id_usuario),
        );

        setCurrentData(reports);
        setFinalData(endReports);
        setCurrentMechanic(availableMechanics);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP]);

  const validation = () => {
    const errors = {};

    if (!mecanicoNovedad.trim()) {
      errors.mecanicoNovedad = "El mecánico es obligatorio.";
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

    if (date.getHours() >= 22  && date.getHours() < 0) {
      date.setDate(date.getDate() - 1);
    }

    if (date.getHours() >= 0  && date.getHours() < 6) {
      date.setDate(date.getDate() + 1);
    }

    const novedad = [
      {
        fecha_novedad: fechaNovedad,
        fecha_auxiliar_novedad: date.toISOString().split("T")[0],
        hora_novedad: horaNovedad,
        turno_novedad: shiftNovelty,
        tipo_novedad: "Adición de mecánico",
        mecanico_novedad: mecanicoNovedad,
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
          `Error al crear la adición de mecánico. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectGenerateReport = () => {
    navigate("/generatereport/noveltyoption");
  };

  // noinspection JSValidateTypes
  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyComponentFormAlternative}
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
              className={Style.generateNoveltyComponentFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : sendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyComponentFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Mecánico añadido con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyComponentForm}
              onSubmit={sendCreate}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header className={Style.generateNoveltyComponentFormHeader}>
                <h1>Complete los datos para cambiar el mecánico</h1>
              </header>
              <main className={Style.generateNoveltyComponentFormMain}>
                <fieldset>
                  <label htmlFor="mecanicoNovedad">Nuevo mecánico</label>
                  <select
                    id="mecanicoNovedad"
                    name="mecanicoNovedad"
                    value={mecanicoNovedad}
                    onChange={(e) => setMecanicoNovedad(e.target.value)}
                  >
                    <option value="" disabled>
                      Seleccione un nuevo mecánico
                    </option>
                    {currentMechanic.map((item) => (
                      <option key={item.id_usuario} value={item.id_usuario}>
                        {item.nombre_usuario}
                      </option>
                    ))}
                  </select>
                  {validationError.mecanicoNovedad && (
                    <motion.span
                      className={Style.generateNoveltyComponentFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.mecanicoNovedad}
                    </motion.span>
                  )}
                </fieldset>

                <fieldset>
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
              <footer className={Style.generateNoveltyComponentFormFooter}>
                <button onClick={() => redirectGenerateReport()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Añadir mecánico"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyComponentFormValidationServer
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
              className={Style.generateNoveltyComponentFormAlternative}
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

export default GenerateNoveltyMechanicForm;
