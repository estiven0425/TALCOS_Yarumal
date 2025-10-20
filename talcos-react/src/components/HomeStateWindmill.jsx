import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/home-state-windmill.module.css";

function HomeStateWindmill() {
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

        // noinspection EqualityComparisonWithCoercionJS
        const operatorsChange = responseNews.data.filter(
          (novelty) =>
            novelty.tipo_novedad === "Cambio de operador de molino" ||
            novelty.tipo_novedad == "Encendido de molino",
        );

        // noinspection EqualityComparisonWithCoercionJS
        const news = responseNews.data.filter(
          (novelty) =>
            novelty.tipo_novedad === "Paro" ||
            novelty.tipo_novedad == "Encendido de molino",
        );

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
            .sort((a, b) => {
              const dateA = new Date(
                `${a.fecha_auxiliar_novedad}T${a.hora_novedad}`,
              );
              const dateB = new Date(
                `${b.fecha_auxiliar_novedad}T${b.hora_novedad}`,
              );
              return dateB - dateA;
            })[0];

          const operatorChange = operatorsChange
            .filter((n) => n.molino_novedad === molino.nombre_molino)
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

          const horometro =
            [
              recent?.horometro_informe_inicial,
              recent?.horometro_inicio_paro_novedad,
              recent?.horometro_fin_paro_novedad,
            ]
              .filter((value) => value !== undefined && value !== null)
              .sort((a, b) => b - a)[0] || "No se registró";

          let paroActivo = null;

          if (novelty?.inicio_paro_novedad) {
            const now = new Date();

            const inicioParo = new Date(
              `${novelty.fecha_auxiliar_novedad}T${novelty.inicio_paro_novedad}`,
            );

            if (inicioParo > now) {
              paroActivo = null;
            } else {
              if (novelty.fin_paro_novedad) {
                let finParo = new Date(
                  `${novelty.fecha_auxiliar_novedad}T${novelty.fin_paro_novedad}`,
                );

                if (finParo <= inicioParo) {
                  finParo.setDate(finParo.getDate() + 1);
                }

                paroActivo =
                  now >= inicioParo && now < finParo
                    ? novelty.inicio_paro_novedad
                    : null;
              } else {
                paroActivo =
                  now >= inicioParo ? novelty.inicio_paro_novedad : null;
              }
            }
          }

          return {
            id_molino: molino.id_molino,
            nombre_molino: molino.nombre_molino,
            operador: (() => {
              const fechaHoraOperatorChange = operatorChange
                ? new Date(
                    `${operatorChange.fecha_novedad} ${operatorChange.hora_novedad}`,
                  )
                : null;

              const fechaHoraRecent = recent
                ? new Date(
                    recent.fecha_informe_inicial
                      ? `${recent.fecha_informe_inicial} ${recent.hora_informe_inicial}`
                      : `${recent.fecha_novedad} ${recent.hora_novedad}`,
                  )
                : null;

              if (
                fechaHoraOperatorChange &&
                (!fechaHoraRecent || fechaHoraOperatorChange > fechaHoraRecent)
              ) {
                return (
                  operatorChange.operador?.nombre_usuario || "No se registró"
                );
              }

              return recent?.operador?.nombre_usuario || "No se registró";
            })(),
            horometro,
            paro: paroActivo,
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
      className={Style.homeStateWindmill}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={Style.homeStateWindmillHeader}>
        <h1>Estado de molinos</h1>
      </header>
      <main className={Style.homeStateWindmillMain}>
        {molino.map((molino) => (
          <div key={molino.id_molino}>
            <section className={Style.homeStateWindmillMainPrimary}>
              <h2>{molino.nombre_molino}</h2>
              <p>{molino.operador}</p>
            </section>
            <section className={Style.homeStateWindmillMainSecondary}>
              <p>
                {molino.paro ||
                molino.operador === "No se registró" ||
                molino.horometro === "No se registró" ? (
                  <i
                    className={`bi bi-x-circle-fill ${Style.homeStateWindmillMainSecondaryIconAlternative}`}
                  ></i>
                ) : (
                  <i
                    className={`bi bi-check-circle-fill ${Style.homeStateWindmillMainSecondaryIcon}`}
                  ></i>
                )}
              </p>
              <p>
                {molino.horometro === "No se registró"
                  ? molino.horometro
                  : molino.horometro + " Hrs"}
              </p>
            </section>
          </div>
        ))}
      </main>
    </motion.div>
  ) : (
    <motion.div
      className={Style.homeStateWindmillAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default HomeStateWindmill;
