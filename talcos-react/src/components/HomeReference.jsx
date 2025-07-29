import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/home-reference.module.css";

function HomeReference() {
  const [molino, setMolino] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

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
        const responseReport = await axios.get(
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

        const reports = responseReport.data;
        const news = responseNews.data;

        const combinedData = mills.map((molino) => {
          const report = reports
            .filter(
              (report) =>
                report.molino_informe_inicial === molino.nombre_molino,
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial),
            )[0];

          const novelty = news
            .filter(
              (novelty) => novelty.molino_novedad === molino.nombre_molino,
            )
            .sort(
              (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad),
            )[0];

          const recent =
            report &&
            (!novelty ||
              new Date(
                report.fecha_informe_inicial +
                  " " +
                  report.hora_informe_inicial,
              ) >
                new Date(
                  novelty.fecha_auxiliar_novedad + " " + novelty.hora_novedad,
                ))
              ? report
              : novelty;

          return {
            id_molino: molino.id_molino,
            nombre_molino: molino.nombre_molino,
            referencia:
              recent?.referencia_informe_inicial ||
              recent?.referencia_novedad ||
              "No se registró",
            bulto:
              recent?.bulto_informe_inicial ||
              recent?.bulto_novedad ||
              "No se registró",
          };
        });

        setMolino(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getData();
  }, [localIP]);

  return molino.length > 0 ? (
    <motion.div
      className={Style.homeReference}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={Style.homeReferenceHeader}>
        <h1>Referencias en producción</h1>
      </header>
      <main className={Style.homeReferenceMain}>
        {molino.map((molino) => (
          <div key={molino.id_molino}>
            <section className={Style.homeReferenceMainPrimary}>
              <h2>{molino.nombre_molino}</h2>
              <p>{molino.referencia}</p>
            </section>
            <section className={Style.homeReferenceMainSecondary}>
              <p>{molino.bulto}</p>
            </section>
          </div>
        ))}
      </main>
    </motion.div>
  ) : (
    <motion.div
      className={Style.homeReferenceAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default HomeReference;
