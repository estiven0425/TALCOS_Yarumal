import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-reference.module.css';

function HomeReference() {
    const [molino, setMolino] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getData = async () => {
            try {
                const responseMolinos = await axios.get(`http://${localIP}:3000/molinos`);
                const molinos = responseMolinos.data;
                const responseTurnos = await axios.get(`http://${localIP}:3000/turnos`);
                const turnos = responseTurnos.data;
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

                const currentShift = turnos.find(turno => compareTime(currentTime, turno.inicio_turno, turno.fin_turno));
                if (!currentShift) {
                    console.error("No se pudo determinar el turno actual.");
                    return;
                }

                const currentDate = currentTime.toISOString().split('T')[0];
                const { nombre_turno: turno, inicio_turno: inicioTurno, fin_turno: finTurno } = currentShift;
                const responseInformes = await axios.get(`http://${localIP}:3000/informes_iniciales/turnoinformeinicial`, {
                    params: {
                        fecha: currentDate,
                        turno, inicioTurno,
                        finTurno
                    }
                });
                const responseNovedades = await axios.get(`http://${localIP}:3000/novedades/turnonovedad`, {
                    params: {
                        fecha: currentDate,
                        turno, inicioTurno,
                        finTurno
                    }
                });

                const informes = responseInformes.data;
                const novedades = responseNovedades.data;
                const combinedData = molinos.map(molino => {
                    const informe = informes
                        .filter(informe => informe.molino_informe_inicial === molino.nombre_molino)
                        .sort((a, b) => new Date(b.hora_informe_inicial) - new Date(a.hora_informe_inicial))[0];
                    const novedad = novedades
                        .filter(novedad => novedad.molino_novedad === molino.nombre_molino)
                        .sort((a, b) => new Date(b.hora_novedad) - new Date(a.hora_novedad))[0];
                    const reciente = (informe && (!novedad || new Date(informe.fecha_informe_inicial + ' ' + informe.hora_informe_inicial) > new Date(novedad.fecha_novedad + ' ' + novedad.hora_novedad)))
                        ? informe
                        : novedad;

                    return {
                        id_molino: molino.id_molino,
                        nombre_molino: molino.nombre_molino,
                        referencia: reciente?.referencia_informe_inicial || reciente?.referencia_novedad || 'No se registró',
                        bulto: reciente?.bulto_informe_inicial || reciente?.bulto_novedad || 'No se registró'
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
        <motion.div className={Style.homeReference}>
            <header className={Style.homeReferenceHeader}>
                <h1>Referencias en producción</h1>
            </header>
            <main className={Style.homeReferenceMain}>
                {molino.map(molino => (
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
        <motion.div className={Style.homeReferenceAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeReference;