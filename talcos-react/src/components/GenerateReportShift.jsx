import { es } from "date-fns/locale";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-report-shift.module.css";

function GenerateReportShift() {
  const [currentShift, setCurrentShift] = useState(null);
  const [currentShiftDate, setCurrentShiftDate] = useState(new Date());
  const [shiftState, setShiftState] = useState({
    startReport: false,
    news: 0,
    endReport: false,
  });
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getShifts = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = response.data;

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

        currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
        currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);

        setCurrentShiftDate(fechaTurno);
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

        const startReports = responseStartReport.data;
        const news = responseNews.data;
        const endReports = responseEndReport.data;

        const startReport = startReports.length > 0;
        const novelty = news.length;
        const endReport = endReports.length > 0;

        setShiftState({
          startReport,
          news: novelty,
          endReport,
        });

        setCurrentShift(currentShift);
      } catch (error) {
        console.error("Error al obtener el turno:", error);
      }
    };

    void getShifts();
  }, [localIP]);

  const formatDate = (dateToFormat) => {
    if (!dateToFormat) return "";

    const formattedDate = format(dateToFormat, "EEEE d 'de' MMMM 'del' yyyy", {
      locale: es,
    });

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  return currentShift !== null ? (
    <motion.section
      className={Style.generateReportShift}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <article className={Style.generateReportShiftPrimary}>
        <h1>Estado del turno</h1>
        <p>
          {formatDate(currentShiftDate)} ({currentShift.nombre_turno}):{" "}
          {currentShift.inicio_turno} - {currentShift.fin_turno}
        </p>
      </article>
      <article className={Style.generateReportShiftSecondary}>
        <div>
          <h2>Informe inicial</h2>
          <p>
            {shiftState.startReport ? (
              <i
                className={`bi bi-check-circle-fill ${Style.generateReportShiftIcon}`}
              ></i>
            ) : (
              <i
                className={`bi bi-x-circle-fill ${Style.generateReportShiftSecondaryIconAlternative}`}
              ></i>
            )}
          </p>
        </div>
        <div>
          <h2>Novedades</h2>
          <p>{shiftState.news}</p>
        </div>
        <div>
          <h2>Informe final</h2>
          <p>
            {shiftState.endReport ? (
              <i
                className={`bi bi-check-circle-fill ${Style.generateReportShiftIcon}`}
              ></i>
            ) : (
              <i
                className={`bi bi-x-circle-fill ${Style.generateReportShiftSecondaryIconAlternative}`}
              ></i>
            )}
          </p>
        </div>
      </article>
    </motion.section>
  ) : (
    <motion.div
      className={Style.generateReportShiftAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default GenerateReportShift;
