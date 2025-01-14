import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-shift.module.css';

function HomeShift() {
    const [currentShift, setCurrentShift] = useState(null);
    const [nextTurn, setNextTurn] = useState(null);
    const [overallEfficiency, setOverallEfficiency] = useState('100');
    const [totalStrike, settotalStrike] = useState('0');
    const [supervisor, setSupervisor] = useState('Cristobal Garcia');
    const [controlCalidad, setControlCalidad] = useState('Arley Gutierrez');
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getShifts = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/turnos`);
                const shifts = response.data;
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
                const indexCurrentShift = shifts.findIndex(shift => shift.id_turno === currentShift.id_turno);
                const nextTurn = shifts[(indexCurrentShift + 1) % shifts.length];

                currentShift.inicio_turno = currentShift.inicio_turno.slice(0, 5);
                currentShift.fin_turno = currentShift.fin_turno.slice(0, 5);
                nextTurn.inicio_turno = nextTurn.inicio_turno.slice(0, 5);
                nextTurn.fin_turno = nextTurn.fin_turno.slice(0, 5);

                setCurrentShift(currentShift);
                setNextTurn(nextTurn);
            } catch (error) {
                console.error('Error al obtener turnos:', error);
            }
        };

        getShifts();
    }, [localIP]);

    return (
        <motion.div className={Style.homeShift}>
            <section className={Style.homeShiftPrimary}>
                {currentShift && nextTurn ? (
                    <>
                        <h1>Turno actual: {currentShift.inicio_turno} - {currentShift.fin_turno}</h1>
                        <p>Próximo turno: {nextTurn.inicio_turno} - {nextTurn.fin_turno}</p>
                    </>
                ) : (
                    <div className={Style.loader}></div>
                )}
            </section>
            <section className={Style.homeShiftSecondary}>
                <div>
                    <h2>Eficiencia total:</h2>
                    {overallEfficiency ? (
                        <p>{overallEfficiency}%</p>
                    ) : (
                        <div className={Style.loaderAlternative}></div>
                    )}
                </div>
                <div>
                    <h2>Paros totales:</h2>
                    {totalStrike ? (
                        <p>{totalStrike}</p>
                    ) : (
                        <div className={Style.loaderAlternative}></div>
                    )}
                </div>
                <div>
                    <h2>Supervisor:</h2>
                    {supervisor ? (
                        <p>{supervisor}</p>
                    ) : (
                        <div className={Style.loaderAlternative}></div>
                    )}
                </div>
                <div>
                    <h2>Control de calidad:</h2>
                    {controlCalidad ? (
                        <p>{controlCalidad}</p>
                    ) : (
                        <div className={Style.loaderAlternative}></div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}

export default HomeShift;