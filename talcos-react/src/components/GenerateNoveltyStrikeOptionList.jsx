import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/generate-novelty-strike-option-list.module.css";

function GenerateNoveltyStrikeOptionList() {
  const [currentData, setCurrentData] = useState(null);
  const [novelty, setNovelty] = useState({});
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getData = async () => {
      try {
        // noinspection HttpUrlsUsage
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
          compareTime(currentTime, shift.inicio_turno, shift.fin_turno),
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

        // noinspection HttpUrlsUsage
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          },
        );

        // noinspection HttpUrlsUsage
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/listanovedad`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          },
        );

        const reports = responseStartReport.data;
        const news = responseNews.data;

        setCurrentData(reports);
        setNovelty(news);
      } catch (error) {
        console.error("Error al obtener las novedades: ", error);
      } finally {
        setLoadingAlternative(false);
      }
    };

    void getData();
  }, [localIP]);

  return (
    <>
      {loadingAlternative ? (
        <motion.div
          className={Style.generateNoveltyStrikeOptionListAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.div>
      ) : novelty.length > 0 ? (
        <motion.table
          className={Style.generateNoveltyStrikeOptionListMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.generateNoveltyStrikeOptionListMainTableHead}>
            <tr>
              <th>Molino</th>
              <th>Operador de molino</th>
              <th>Inicio de paro</th>
              <th>Fin de paro</th>
              <th>Horómetro de inicio de paro</th>
              <th>Horómetro de fin de paro</th>
              <th>Motivo paro</th>
            </tr>
          </thead>
          <tbody className={Style.generateNoveltyStrikeOptionListMainTableBody}>
            {novelty.map((novedad) => (
              <tr key={novedad.id_novedad}>
                <td>{novedad.molino_novedad}</td>
                <td>{novedad.operador?.nombre_usuario}</td>
                <td>{novedad.inicio_paro_novedad}</td>
                <td>
                  {novedad.fin_paro_novedad !== null
                    ? novedad.fin_paro_novedad
                    : "No registrado"}
                </td>
                <td>{novedad.horometro_inicio_paro_novedad}</td>
                <td>
                  {novedad.horometro_fin_paro_novedad !== null
                    ? novedad.horometro_fin_paro_novedad
                    : "No registrado"}
                </td>
                <td>{novedad.motivo_paro_novedad}</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.generateNoveltyStrikeOptionListMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>
            {currentData.length === 0
              ? "El informe inicial del turno no ha sido creado"
              : "No existen paros"}
          </h2>
        </motion.div>
      )}
    </>
  );
}

export default GenerateNoveltyStrikeOptionList;
