import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-novelty-strike-stop-list.module.css";

function GenerateNoveltyStrikeStopList() {
  const [novelty, setNovelty] = useState({});
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
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades/listaparonovedad`,
          {
            params: {
              fecha: currentDate,
              turno,
              inicioTurno,
              finTurno,
            },
          }
        );

        const news = responseNews.data;

        setNovelty(news);
      } catch (error) {
        console.error("Error al obtener las novedades: ", error);
      }
    };

    getData();
  }, [localIP]);

  const redirectNovelty = () => {
    navigate("/generatereport/noveltystrike");
  };
  const redirectEditNovelty = (novedad) => {
    navigate("/generatereport/noveltystrikestopfinish", { state: novedad });
  };

  return (
    <>
      <header className={Style.generateNoveltyStrikeStopListHeader}>
        <h1>Seleccione un paro para finalizar</h1>
      </header>
      <main className={Style.generateNoveltyStrikeStopListMain}>
        {novelty.length > 0 ? (
          <motion.table
            className={Style.generateNoveltyStrikeStopListMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.generateNoveltyStrikeStopListMainTableHead}>
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
            <tbody className={Style.generateNoveltyStrikeStopListMainTableBody}>
              {novelty.map((novedad) => (
                <tr
                  key={novedad.id_novedad}
                  onClick={() => redirectEditNovelty(novedad.id_novedad)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectEditNovelty(novedad.id_novedad);
                    }
                  }}
                  tabIndex="0"
                >
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
            className={Style.generateNoveltyStrikeStopListMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen paros</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.generateNoveltyStrikeStopListFooter}>
        <button type="button" onClick={() => redirectNovelty()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default GenerateNoveltyStrikeStopList;
