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
        const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShifts.data;
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
        if (!currentShift) {
          console.error("No se pudo determinar el turno actual.");
          return;
        }

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
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales/turnoinformefinal`,
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
        const endReports = responseEndReport.data;

        setCurrentData(reports);
        setFinalData(endReports);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    getData();
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
