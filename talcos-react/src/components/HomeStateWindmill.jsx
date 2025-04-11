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
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;
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
        const responseReport = await axios.get(
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
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );

        const reports = responseReport.data;
        const operatorsChange = responseNews.data.filter(
          (novelty) => novelty.tipo_novedad === "Cambio de operador de molino"
        );
        const news = responseNews.data.filter(
          (novelty) => novelty.tipo_novedad === "Paro"
        );
        const combinedData = mills.map((molino) => {
          const report = reports
            .filter(
              (report) => report.molino_informe_inicial === molino.nombre_molino
            )
            .sort(
              (a, b) =>
                new Date(b.hora_informe_inicial) -
                new Date(a.hora_informe_inicial)
            )[0];
          const novelty = news
            .filter((n) => n.molino_novedad === molino.nombre_molino)
            .sort(
              (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad)
            )[0];
          const operatorChange = operatorsChange
            .filter((n) => n.molino_novedad === molino.nombre_molino)
            .sort(
              (a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad)
            )[0];
          const recent =
            report &&
            (!novelty ||
              new Date(
                report.fecha_informe_inicial + " " + report.hora_informe_inicial
              ) > new Date(novelty.fecha_novedad + " " + novelty.hora_novedad))
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

          return {
            id_molino: molino.id_molino,
            nombre_molino: molino.nombre_molino,
            operador:
              operatorChange?.operador?.nombre_usuario ||
              recent?.operador?.nombre_usuario ||
              "No se registró",
            horometro,
            paro:
              novelty?.inicio_paro_novedad && !novelty?.fin_paro_novedad
                ? novelty?.inicio_paro_novedad
                : null,
          };
        });

        setMolino(combinedData);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getData();
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
              <p>{molino.horometro} Hrs</p>
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
