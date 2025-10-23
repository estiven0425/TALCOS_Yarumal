import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/generate-novelty-strike-stop-form.module.css";

function GenerateNoveltyStrikeStopForm() {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [idNovedad, setIdNovedad] = useState("");
  const [finParoNovedad, setFinParoNovedad] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const novelty = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    setIdNovedad(novelty);
  }, [novelty]);

  useEffect(() => {
    const getData = async () => {
      try {
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

        setCurrentShift(currentShift);

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
        const endReports = responseEndReport.data;

        setCurrentData(reports);
        setFinalData(endReports);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP]);

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/noveltystrikestop");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!finParoNovedad.trim()) {
      errors.finParoNovedad = "El fin de paro es obligatorio.";
    } else {
      const [inicioTurnoHour, inicioTurnoMinute] = currentShift.inicio_turno
        .split(":")
        .map(Number);

      const [finTurnoHour, finTurnoMinute] = currentShift.fin_turno
        .split(":")
        .map(Number);

      const [finParoHour, finParoMinute] = finParoNovedad
        .split(":")
        .map(Number);

      const inicioTurnoMs = (inicioTurnoHour * 60 + inicioTurnoMinute) * 60000;
      const finTurnoMs = (finTurnoHour * 60 + finTurnoMinute) * 60000;
      const finParoMs = (finParoHour * 60 + finParoMinute) * 60000;

      if (inicioTurnoMs < finTurnoMs) {
        if (!(finParoMs >= inicioTurnoMs && finParoMs < finTurnoMs)) {
          errors.finParoNovedad = "La hora de fin debe estar dentro del turno.";
        }
      } else {
        const estaDentro =
          (finParoMs >= inicioTurnoMs && finParoMs < 24 * 60 * 60000) ||
          (finParoMs >= 0 && finParoMs < finTurnoMs);

        if (!estaDentro) {
          errors.finParoNovedad = "La hora de fin debe estar dentro del turno.";
        }
      }
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const sendEditNovelty = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      // noinspection HttpUrlsUsage
      await axios.put(`http://${localIP}:3000/novedades/finparonovedad`, {
        id_novedad: idNovedad,
        fin_paro_novedad: finParoNovedad,
        horometro_fin_paro_novedad: 0,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          "Error al finalizar el paro. Por favor, inténtelo de nuevo.",
        );
        setLoading(false);
      }
    }
  };

  const redirectNovelty = () => {
    navigate("/generatereport/noveltystrike");
  };

  // noinspection JSValidateTypes
  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyStrikeStopFormAlternative}
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
              className={Style.generateNoveltyStrikeStopFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : SendStatus === true ? (
            <motion.div
              className={Style.generateNoveltyStrikeStopFormAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h1>Paro finalizado con éxito</h1>
            </motion.div>
          ) : currentData.length > 0 ? (
            <motion.form
              className={Style.generateNoveltyStrikeStopForm}
              onSubmit={sendEditNovelty}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <header className={Style.generateNoveltyStrikeStopFormHeader}>
                <h1>Complete los datos para finalizar el paro</h1>
              </header>
              <main className={Style.generateNoveltyStrikeStopFormMain}>
                <fieldset
                  className={Style.generateNoveltyStrikeStopFormMainEspecial}
                >
                  <label htmlFor="finParoNovedad">Fin de paro</label>
                  <input
                    id="finParoNovedad"
                    name="finParoNovedad"
                    type="time"
                    value={finParoNovedad}
                    onChange={(e) => setFinParoNovedad(e.target.value)}
                  />
                  {!validationError.finParoNovedad ? (
                    <></>
                  ) : (
                    <motion.span
                      className={Style.generateNoveltyStrikeStopFormValidation}
                      initial={{ zoom: 0 }}
                      animate={{ zoom: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {validationError.finParoNovedad}
                    </motion.span>
                  )}
                </fieldset>
              </main>
              <footer className={Style.generateNoveltyStrikeStopFormFooter}>
                <button onClick={() => redirectNovelty()} type="button">
                  Cancelar
                </button>
                <button type="submit">
                  {loading ? (
                    <div className={Style.loader}></div>
                  ) : (
                    "Finalizar paro"
                  )}
                </button>
                {!serverError ? (
                  <></>
                ) : (
                  <motion.span
                    className={
                      Style.generateNoveltyStrikeStopFormValidationServer
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
              className={Style.generateNoveltyStrikeStopFormAlternative}
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

export default GenerateNoveltyStrikeStopForm;
