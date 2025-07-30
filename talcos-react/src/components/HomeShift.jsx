import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/home-shift.module.css";

function HomeShift() {
  const [currentShift, setCurrentShift] = useState(null);
  const [nextTurn, setNextTurn] = useState(null);
  const [overallEfficiency, setOverallEfficiency] = useState();
  const [totalStrike, setTotalStrike] = useState();
  const [supervisor, setSupervisor] = useState();
  const [controlCalidad, setControlCalidad] = useState();
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

        const calculateDuration = (start, end) => {
          const [startHour, startMinute] = start.split(":").map(Number);
          const [endHour, endMinute] = end.split(":").map(Number);

          let startMs = (startHour * 60 + startMinute) * 60000;
          let endMs = (endHour * 60 + endMinute) * 60000;

          if (endMs < startMs) {
            endMs += 24 * 60 * 60000;
          }

          const totalMinutes = Math.round((endMs - startMs) / 60000);
          const hours = Math.floor(totalMinutes / 60);

          const minutes = totalMinutes % 60;

          return hours + minutes / 60;
        };

        const { shift: currentShift, fechaTurno } = getShiftForDate(
          shifts,
          currentTime,
        );

        if (!currentShift) {
          console.warn("No se encontró turno actual.");
          return;
        }

        const indexCurrentShift = shifts.findIndex(
          (shift) => shift.id_turno === currentShift.id_turno,
        );

        const nextTurn = shifts[(indexCurrentShift + 1) % shifts.length];

        currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
        currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);
        nextTurn.inicio_turno = nextTurn.inicio_turno.slice(0, 5);
        nextTurn.fin_turno = nextTurn.fin_turno.slice(0, 5);

        setCurrentShift(currentShift);
        setNextTurn(nextTurn);

        // noinspection HttpUrlsUsage
        const reportResponse = await axios.get(
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

        const reportData = reportResponse.data;

        const lastReport = reportData[0];

        const molinosEnInforme = reportData.filter(
          (report) =>
            report.molino_informe_inicial !== null &&
            report.molino_informe_inicial !== undefined,
        );

        const cantidadMolinosEnInforme = molinosEnInforme.length;

        // noinspection JSUnresolvedReference
        setSupervisor(lastReport?.titular?.nombre_usuario || "No disponible");
        // noinspection JSUnresolvedReference
        setControlCalidad(lastReport?.cdc?.nombre_usuario || "No disponible");

        // noinspection HttpUrlsUsage
        const newResponse = await axios.get(
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

        const novelty = newResponse.data;

        const shiftDuration = calculateDuration(
          currentShift.inicio_turno,
          currentShift.fin_turno,
        );

        // noinspection UnnecessaryLocalVariableJS
        const totalPossibleHoursInitial =
          shiftDuration * cantidadMolinosEnInforme;

        let totalPossibleHours = totalPossibleHoursInitial;

        const paroCount = novelty.filter(
          (novedad) => novedad.tipo_novedad === "Paro",
        );

        setTotalStrike(paroCount.length);

        const totalParoDuration = paroCount.reduce((total, novedad) => {
          const inicioParo = novedad.inicio_paro_novedad;

          let finParo = novedad.fin_paro_novedad;

          if (!finParo) finParo = currentShift.fin_turno;

          return total + calculateDuration(inicioParo, finParo);
        }, 0);

        const encendidos = novelty.filter(
          (novedad) => novedad.tipo_novedad === "Encendido de molino",
        );

        let totalEncendidoDelay = 0;

        const encendidosPorMolino = {};

        encendidos.forEach((novedad) => {
          const idMolino = novedad.id_molino;

          if (
            !encendidosPorMolino[idMolino] ||
            novedad.hora_novedad < encendidosPorMolino[idMolino].hora_novedad
          ) {
            encendidosPorMolino[idMolino] = novedad;
          }
        });

        Object.values(encendidosPorMolino).forEach((novedad) => {
          const horaEncendido = novedad.hora_novedad;

          const tiempoPerdidoEncendido = calculateDuration(
            currentShift.inicio_turno,
            horaEncendido,
          );

          totalEncendidoDelay += tiempoPerdidoEncendido;

          const tiempoPosibleEncendido = calculateDuration(
            horaEncendido,
            currentShift.fin_turno,
          );

          totalPossibleHours += tiempoPosibleEncendido;
        });

        const initialReportTime =
          lastReport?.hora_informe_inicial?.slice(0, 5) ||
          currentShift.inicio_turno;

        const initialReportDelay =
          calculateDuration(currentShift.inicio_turno, initialReportTime) *
          cantidadMolinosEnInforme;

        const totalLostHours =
          totalParoDuration + totalEncendidoDelay + initialReportDelay;

        const productiveHours = totalPossibleHours - totalLostHours;

        const efficiency = (productiveHours / totalPossibleHours) * 100;

        if (!isFinite(efficiency)) {
          // noinspection JSCheckFunctionSignatures
          setOverallEfficiency("No disponible");
        } else {
          // noinspection JSCheckFunctionSignatures
          setOverallEfficiency(efficiency.toFixed(2));
        }
      } catch (error) {
        console.error("Error al obtener turnos o informe inicial:", error);
      }
    };

    void getShifts();
  }, [localIP]);

  return currentShift !== null ? (
    <motion.div
      className={Style.homeShift}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <header className={Style.homeShiftHeader}>
        <h1>
          Turno actual: {currentShift.inicio_turno} - {currentShift.fin_turno}
        </h1>
        <p>
          Próximo turno: {nextTurn.inicio_turno} - {nextTurn.fin_turno}
        </p>
      </header>
      <main className={Style.homeShiftMain}>
        <div>
          <h2>Eficiencia total:</h2>
          {overallEfficiency ? (
            <p>
              {overallEfficiency === "No disponible"
                ? "No disponible"
                : overallEfficiency + "%"}
            </p>
          ) : (
            <p>Obteniendo datos...</p>
          )}
        </div>
        <div>
          <h2>Paros totales:</h2>
          {totalStrike !== null ? (
            <p>{totalStrike}</p>
          ) : (
            <p>Obteniendo datos...</p>
          )}
        </div>
        <div>
          <h2>Supervisor:</h2>
          {supervisor ? <p>{supervisor}</p> : <p>Obteniendo datos...</p>}
        </div>
        <div>
          <h2>Control de calidad:</h2>
          {controlCalidad ? (
            <p>{controlCalidad}</p>
          ) : (
            <p>Obteniendo datos...</p>
          )}
        </div>
      </main>
    </motion.div>
  ) : (
    <motion.div
      className={Style.homeShiftAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default HomeShift;
