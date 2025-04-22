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
        const response = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = response.data;
        const responseMills = await axios.get(`http://${localIP}:3000/molinos`);
        const mills = responseMills.data;
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

        const calculateDuration = (start, end) => {
          const [startHour, startMinute] = start.split(":").map(Number);
          const [endHour, endMinute] = end.split(":").map(Number);
          const startMs = (startHour * 60 + startMinute) * 60000;
          const endMs = (endHour * 60 + endMinute) * 60000;
          return (endMs - startMs) / 3600000;
        };

        const currentShift = shifts.find((shift) =>
          compareTime(currentTime, shift.inicio_turno, shift.fin_turno)
        );
        const indexCurrentShift = shifts.findIndex(
          (shift) => shift.id_turno === currentShift.id_turno
        );
        const nextTurn = shifts[(indexCurrentShift + 1) % shifts.length];

        currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
        currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);
        nextTurn.inicio_turno = nextTurn.inicio_turno.slice(0, 5);
        nextTurn.fin_turno = nextTurn.fin_turno.slice(0, 5);

        setCurrentShift(currentShift);
        setNextTurn(nextTurn);

        const currentDate = currentTime.toISOString().split("T")[0];
        const reportResponse = await axios.get(
          `http://${localIP}:3000/informes_iniciales/turnoinformeinicial`,
          {
            params: {
              fecha: currentDate,
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          }
        );

        const lastReport = reportResponse.data[0];

        setSupervisor(lastReport?.titular?.nombre_usuario || "No disponible");
        setControlCalidad(lastReport?.cdc?.nombre_usuario || "No disponible");

        const newResponse = await axios.get(
          `http://${localIP}:3000/novedades/turnonovedad`,
          {
            params: {
              fecha: currentDate,
              turno: currentShift.nombre_turno,
              inicioTurno: currentShift.inicio_turno,
              finTurno: currentShift.fin_turno,
            },
          }
        );

        const novelty = newResponse.data;
        const paroCount = novelty.filter(
          (novedad) =>
            novedad.tipo_novedad === "Paro" &&
            novedad.motivo_paro_novedad !== "Apagado"
        );
        const totalParoDuration = paroCount.reduce((total, novedad) => {
          const inicioParo = novedad.inicio_paro_novedad;
          let finParo = novedad.fin_paro_novedad;

          if (!finParo) {
            finParo = currentShift.fin_turno;
          }

          return total + calculateDuration(inicioParo, finParo);
        }, 0);

        const shiftDuration = calculateDuration(
          currentShift.inicio_turno,
          currentShift.fin_turno
        );
        const totalShiftHours = shiftDuration * mills.length;
        const efficiency = 100 - (totalParoDuration / totalShiftHours) * 100;

        setTotalStrike(paroCount.length);
        setOverallEfficiency(efficiency.toFixed(2));
      } catch (error) {
        console.error("Error al obtener turnos o informe inicial:", error);
      }
    };

    getShifts();
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
            <p>{overallEfficiency}%</p>
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
