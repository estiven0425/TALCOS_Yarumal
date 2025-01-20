import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-state-shift.module.css';

function HomeStateShift() {
    const [shiftState, setShiftState] = useState({
        startReport: false,
        news: 0,
        endReport: false
    });
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getData = async () => {
            try {
                const responseShifts = await axios.get(`http://${localIP}:3000/turnos`);
                const shifts = responseShifts.data;
                const currentTime = new Date();

                const compareTime = (hour, start, end) => {
                    const [startTime, startMinute] = start.split(':').map(Number);
                    const [endTime, endMinute] = end.split(':').map(Number);
                    const startTimeMs = (startTime * 60 + startMinute) * 60000;
                    const endTimeMs = (endTime * 60 + endMinute) * 60000;
                    const currentTimeMs = (hour.getHours() * 60 + hour.getMinutes()) * 60000;

                    if (endTimeMs > startTimeMs) {
                        return currentTimeMs >= startTimeMs && currentTimeMs < endTimeMs;
                    } else {
                        return currentTimeMs >= startTimeMs || currentTimeMs < endTimeMs;
                    }
                };

                const currentShift = shifts.find(shift => compareTime(currentTime, shift.inicio_turno, shift.fin_turno));
                if (!currentShift) {
                    console.error("No se pudo determinar el turno actual.");
                    return;
                }

                const currentDate = currentTime.toISOString().split('T')[0];
                const { nombre_turno: turno, inicio_turno: inicioTurno, fin_turno: finTurno } = currentShift;
                const responseStartReport = await axios.get(`http://${localIP}:3000/informes_iniciales/turnoinformeinicial`, {
                    params: {
                        fecha: currentDate,
                        turno, inicioTurno,
                        finTurno
                    }
                });
                const responseNews = await axios.get(`http://${localIP}:3000/novedades/turnonovedad`, {
                    params: {
                        fecha: currentDate,
                        turno, inicioTurno,
                        finTurno
                    }
                });
                const responseEndReport = await axios.get(`http://${localIP}:3000/informes_finales/turnoinformefinal`, {
                    params: {
                        fecha: currentDate,
                        turno, inicioTurno,
                        finTurno
                    }
                });

                const startReports = responseStartReport.data;
                const news = responseNews.data;
                const endReports = responseEndReport.data;
                const startReport = startReports.length > 0;
                const novelty = news.length;
                const endReport = endReports.length > 0;

                setShiftState({
                    startReport,
                    news: novelty,
                    endReport
                });
            } catch (error) {
                console.error("Error al obtener los datos: ", error);
            }
        };

        getData();
    }, [localIP]);

    return shiftState ? (
        <motion.div className={Style.homeStateShift}>
            <header className={Style.homeStateShiftHeader}>
                <h1>Estado del turno</h1>
            </header>
            <main className={Style.homeStateShiftMain}>
                <div>
                    <h2>Informe inicial</h2>
                    <p>
                        {shiftState.startReport ? (
                            <i className={`bi bi-check-circle-fill ${Style.homeStateShiftMainIcon}`}></i>
                        ) : (
                            <i className={`bi bi-x-circle-fill ${Style.homeStateShiftMainIconAlternative}`}></i>
                        )}
                    </p>
                </div>
                <div>
                    <h2>Novedades</h2>
                    <p>{shiftState.news}</p>
                </div>
                <div>
                    <h2>Informe final</h2>
                    <p>
                        {shiftState.endReport ? (
                            <i className={`bi bi-check-circle-fill ${Style.homeStateShiftMainIcon}`}></i>
                        ) : (
                            <i className={`bi bi-x-circle-fill ${Style.homeStateShiftMainIconAlternative}`}></i>
                        )}
                    </p>
                </div>
            </main>
        </motion.div>
    ) : (
        <motion.div className={Style.homeStateShiftAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeStateShift;