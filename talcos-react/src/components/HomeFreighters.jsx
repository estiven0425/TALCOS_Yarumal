import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-freighters.module.css';

function HomeFreighters() {
    const [bobCat, setBobCat] = useState([]);
    const [mecanicos, setMecanicos] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getData = async () => {
            try {
                const responseBobCats = await axios.get(`http://${localIP}:3000/bob_cats`);
                const bobCats = responseBobCats.data;
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
                const responseReport = await axios.get(`http://${localIP}:3000/informes_iniciales/turnoinformeinicial`, {
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

                const reports = responseReport.data;
                const news = responseNews.data;
                const combinedDataBobCat = bobCats.map(bobCat => {
                    const report = reports
                        .filter(report => report.bob_cat_informe_inicial === bobCat.nombre_bob_cat)
                        .sort((a, b) => new Date(b.hora_informe_inicial) - new Date(a.hora_informe_inicial))[0];
                    const novelty = news
                        .filter(novelty => novelty.bob_cat_novedad === bobCat.nombre_bob_cat)
                        .sort((a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad))[0];
                    const recent = (report && (!novelty || new Date(report.fecha_informe_inicial + ' ' + report.hora_informe_inicial) > new Date(novelty.fecha_novedad + ' ' + novelty.hora_novedad)))
                        ? report
                        : novelty;

                    return {
                        id_bob_cat: bobCat.id_bob_cat,
                        nombre_bob_cat: bobCat.nombre_bob_cat,
                        carguero: recent?.carguero?.nombre_usuario || 'No se registró',
                    };
                });

                const combinedDataMecanicos = reports.concat(news)
                    .filter(record => record.mecanico_informe_inicial || record.mecanico_novedad)
                    .map(record => ({
                        nombre_mecanico: record.mecanico?.nombre_usuario || 'No se registró'
                    }));

                setBobCat(combinedDataBobCat);
                setMecanicos(combinedDataMecanicos);
            } catch (error) {
                console.error("Error al obtener los datos: ", error);
            }
        };

        getData();
    }, [localIP]);

    return bobCat.length > 0 || mecanicos.length > 0 ? (
        <motion.div className={Style.homeFreighters}>
            <section className={Style.homeFreightersPrimary}>
                <header className={Style.homeFreightersPrimaryHeader}>
                    <h1>Cargueros</h1>
                </header>
                <main className={Style.homeFreightersPrimaryMain}>
                    {bobCat.map(bobCat => (
                        <div key={bobCat.id_bob_cat}>
                            <h2>{bobCat.nombre_bob_cat}</h2>
                            <p>{bobCat.carguero}</p>
                        </div>
                    ))}
                </main>
            </section>
            <section className={Style.homeFreightersSecondary}>
                <header className={Style.homeFreightersSecondaryHeader}>
                    <h1>Mecánicos</h1>
                </header>
                <main className={Style.homeFreightersSecondaryMain}>
                    {mecanicos.map((mecanico, index) => (
                        <div key={index}>
                            <p>{mecanico.nombre_mecanico}</p>
                        </div>
                    ))}
                </main>
            </section>
        </motion.div>
    ) : (
        <motion.div className={Style.homeFreightersAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeFreighters;