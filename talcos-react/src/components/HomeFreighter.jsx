import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/home-freighter.module.css";

function HomeFreighter() {
  const [bobCat, setBobCat] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getData = async () => {
      try {
        // noinspection HttpUrlsUsage
        const responseBobCats = await axios.get(
          `http://${localIP}:3000/bob_cats`,
        );
        const bobCats = responseBobCats.data;

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

        const combinedDataBobCat = bobCats.map((bobCat) => {
          const report = reports
            .filter(
              (report) =>
                report.bob_cat_informe_inicial === bobCat.nombre_bob_cat,
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial),
            )[0];

          const novelty = news
            .filter(
              (novelty) => novelty.bob_cat_novedad === bobCat.nombre_bob_cat,
            )
            .sort((a, b) => {
              const dateA = new Date(
                `${a.fecha_auxiliar_novedad}T${a.hora_novedad}`,
              );
              const dateB = new Date(
                `${b.fecha_auxiliar_novedad}T${b.hora_novedad}`,
              );
              return dateB - dateA;
            })[0];

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
            id_bob_cat: bobCat.id_bob_cat,
            nombre_bob_cat: bobCat.nombre_bob_cat,
            carguero: recent?.carguero?.nombre_usuario || "No se registró",
          };
        });

        // noinspection JSUnresolvedReference
        const combinedDataMecanicos = reports
          .concat(news)
          .filter(
            (record) =>
              record.mecanico_informe_inicial || record.mecanico_novedad,
          )
          .map((record) => ({
            nombre_mecanico:
              record.mecanico?.nombre_usuario || "No se registró",
          }));

        setBobCat(combinedDataBobCat);
        setMecanicos(combinedDataMecanicos);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getData();
  }, [localIP]);

  return bobCat.length > 0 || mecanicos.length > 0 ? (
    <motion.div
      className={Style.homeFreighter}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section className={Style.homeFreighterPrimary}>
        <header className={Style.homeFreighterPrimaryHeader}>
          <h1>Operador de minicargadores</h1>
        </header>
        <main className={Style.homeFreighterPrimaryMain}>
          {bobCat.map((bobCat) => (
            <div key={bobCat.id_bob_cat}>
              <h2>{bobCat.nombre_bob_cat}</h2>
              <p>{bobCat.carguero}</p>
            </div>
          ))}
        </main>
      </section>
      <section className={Style.homeFreighterSecondary}>
        <header className={Style.homeFreighterSecondaryHeader}>
          <h1>Mecánicos</h1>
        </header>
        <main className={Style.homeFreighterSecondaryMain}>
          {mecanicos.map((mecanico, index) => (
            <div key={index}>
              <p>{mecanico.nombre_mecanico}</p>
            </div>
          ))}
        </main>
      </section>
    </motion.div>
  ) : (
    <motion.div
      className={Style.homeFreighterAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default HomeFreighter;
