import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Style from "./styles/generate-novelty-strike-stop-list.module.css";

function GenerateNoveltyStrikeStopList() {
  const [currentData, setCurrentData] = useState(null);
  const [novelty, setNovelty] = useState({});
  const [loadingAlternative, setLoadingAlternative] = useState(true);
  const navigate = useNavigate();
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
          `http://${localIP}:3000/novedades/listaparonovedad`,
          {
            params: {
              fecha: fechaTurno.toISOString().split("T")[0],
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
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

  const redirectNovelty = () => {
    navigate("/generatereport/noveltystrike");
  };

  const redirectEditNovelty = (novedad) => {
    navigate("/generatereport/noveltystrikestopfinish", { state: novedad });
  };

  // noinspection JSUnresolvedReference
  return (
    <>
      {loadingAlternative ? (
        <motion.div
          className={Style.generateNoveltyStrikeStopListAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.div>
      ) : currentData.length > 0 ? (
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
                <thead
                  className={Style.generateNoveltyStrikeStopListMainTableHead}
                >
                  <tr>
                    <th>Molino</th>
                    <th>Operador de molino</th>
                    <th>Inicio de paro</th>
                    <th>Fin de paro</th>
                    <th>Motivo paro</th>
                  </tr>
                </thead>
                <tbody
                  className={Style.generateNoveltyStrikeStopListMainTableBody}
                >
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
      ) : (
        <motion.div
          className={Style.generateNoveltyStrikeStopListAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>El informe inicial del turno no ha sido creado</h1>
        </motion.div>
      )}
    </>
  );
}

export default GenerateNoveltyStrikeStopList;
