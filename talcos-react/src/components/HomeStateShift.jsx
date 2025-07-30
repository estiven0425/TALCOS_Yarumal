import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/home-state-shift.module.css";

function HomeStateShift() {
  const [shiftState, setShiftState] = useState({
    startReport: false,
    news: 0,
    endReport: false,
  });
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
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getData();
  }, [localIP]);

  return shiftState ? (
    <motion.div
      className={Style.homeStateShift}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={Style.homeStateShiftHeader}>
        <h1>Estado del turno</h1>
      </header>
      <main className={Style.homeStateShiftMain}>
        <div>
          <h2>Informe inicial</h2>
          <p>
            {shiftState.startReport ? (
              <i
                className={`bi bi-check-circle-fill ${Style.homeStateShiftMainIcon}`}
              ></i>
            ) : (
              <i
                className={`bi bi-x-circle-fill ${Style.homeStateShiftMainIconAlternative}`}
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
                className={`bi bi-check-circle-fill ${Style.homeStateShiftMainIcon}`}
              ></i>
            ) : (
              <i
                className={`bi bi-x-circle-fill ${Style.homeStateShiftMainIconAlternative}`}
              ></i>
            )}
          </p>
        </div>
      </main>
    </motion.div>
  ) : (
    <motion.div
      className={Style.homeStateShiftAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default HomeStateShift;
