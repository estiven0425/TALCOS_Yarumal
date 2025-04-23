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
        const news = responseNews.data;
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
            .filter(
              (novelty) => novelty.molino_novedad === molino.nombre_molino
            )
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

    getData();
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
