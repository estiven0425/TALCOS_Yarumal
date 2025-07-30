import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "./styles/generate-novelty-option.module.css";

function GenerateNoveltyOption() {
  const [currentData, setCurrentData] = useState(null);
  const [finalData, setFinalData] = useState([]);
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

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

  const redirect = (category) => {
    navigate(`/${category}`);
  };

  return (
    <>
      {finalData.length > 0 ? (
        <motion.div
          className={Style.generateNoveltyOptionAlternative}
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
              className={Style.generateNoveltyOptionAlternative}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={Style.loader}></div>
            </motion.div>
          ) : currentData.length > 0 ? (
            <>
              <motion.header
                className={Style.generateNoveltyOptionHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1>Seleccione el tipo de novedad que desea ingresar</h1>
              </motion.header>
              <motion.main
                className={Style.generateNoveltyOptionMain}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltystrike")}
                  type="button"
                >
                  <h2>Paro</h2>
                  <img alt="Icono" src="/strike.svg"></img>
                </button>
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltyreference")}
                  type="button"
                >
                  <h2>Cambio de referencia</h2>
                  <img alt="Icono" src="/change_reference.svg"></img>
                </button>
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltyoperator")}
                  type="button"
                >
                  <h2>Cambio de operador de molino</h2>
                  <img alt="Icono" src="/change_operator.svg"></img>
                </button>
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltyfreighter")}
                  type="button"
                >
                  <h2>Cambio de operador de minicargador</h2>
                  <img alt="Icono" src="/change_freighter.svg"></img>
                </button>
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltymechanic")}
                  type="button"
                >
                  <h2>Añadir mecánico</h2>
                  <img alt="Icono" src="/change_mechanic.svg"></img>
                </button>
                <button
                  className={Style.generateNoveltyOptionMainButton}
                  onClick={() => redirect("generatereport/noveltywindmill")}
                  type="button"
                >
                  <h2>Encender molino</h2>
                  <img alt="Icono" src="/windmill.svg"></img>
                </button>
              </motion.main>
            </>
          ) : (
            <motion.div
              className={Style.generateNoveltyOptionAlternative}
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

export default GenerateNoveltyOption;
