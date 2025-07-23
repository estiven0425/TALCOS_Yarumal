import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { registrarTabla } from "../utils/tablaStore";
import axios from "axios";
import PropTypes from "prop-types";
import Style from "./styles/monitoring-list-hours.module.css";

MonitoringListHours.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringListHours({ inicio, fin }) {
  const [molino, setMolino] = useState([]);
  const [turno, setTurno] = useState([]);
  const [item, setItem] = useState(null);
  const [gruposPorMolino, setGruposPorMolino] = useState({});
  const tablaRef = useRef(null);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (!inicio || !fin) return;

    const getData = async () => {
      try {
        // noinspection HttpUrlsUsage
        const responseMonitoring = await axios.get(
          `http://${localIP}:3000/monitoreo`,
          {
            params: { inicio, fin },
          },
        );

        // noinspection HttpUrlsUsage
        const responseWindmill = await axios.get(
          `http://${localIP}:3000/molinos`,
        );

        // noinspection HttpUrlsUsage
        const responseShift = await axios.get(`http://${localIP}:3000/turnos`);

        setItem(responseMonitoring.data);
        setMolino(responseWindmill.data);
        setTurno(responseShift.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getData();
  }, [localIP, inicio, fin]);

  useEffect(() => {
    if (!item || turno.length === 0) return;

    const calculateTurnoDuration = (inicioTurnoStr, finTurnoStr) => {
      let dummyDate = "2000-01-01";

      let inicioDateTime = new Date(`${dummyDate}T${inicioTurnoStr}`);
      let finDateTime = new Date(`${dummyDate}T${finTurnoStr}`);

      if (
        finDateTime.getHours() < inicioDateTime.getHours() ||
        (finDateTime.getHours() === inicioDateTime.getHours() &&
          finDateTime.getMinutes() < inicioDateTime.getMinutes()) ||
        (finDateTime.getHours() === inicioDateTime.getHours() &&
          finDateTime.getMinutes() === inicioDateTime.getMinutes() &&
          finDateTime.getSeconds() < inicioDateTime.getSeconds())
      ) {
        finDateTime.setDate(finDateTime.getDate() + 1);
      }

      if (isNaN(inicioDateTime.getTime()) || isNaN(finDateTime.getTime())) {
        console.warn(
          `Fechas/horas de turno inválidas. Inicio: ${inicioTurnoStr}, Fin: ${finTurnoStr}`,
        );

        return 0;
      }

      const durationMilisegundos =
        finDateTime.getTime() - inicioDateTime.getTime();

      return durationMilisegundos / (1000 * 60 * 60);
    };

    const groupData = () => {
      const informeInicial = item.informeInicial;
      const informeFinal = item.informeFinal;
      const novedades = item.novedades;

      const gruposPorMolino = informeInicial
        .filter((registro) => registro.molino_informe_inicial != null)
        .reduce((acc, registro) => {
          const idMolino = registro.molino_informe_inicial;

          if (!acc[idMolino]) {
            acc[idMolino] = {
              iniciales: [],
              finales: [],
              paros: [],
              totalHorasTrabajadas: 0,
              totalHorasEsperadas: 0,
            };
          }

          acc[idMolino].iniciales.push(registro);

          return acc;
        }, {});

      const encendidos = novedades.filter(
        (n) => n.tipo_novedad === "Encendido de molino",
      );

      encendidos.forEach((encendido) => {
        const idMolino = encendido.molino_novedad;

        if (!gruposPorMolino[idMolino]) {
          gruposPorMolino[idMolino] = {
            iniciales: [],
            finales: [],
            paros: [],
            totalHorasTrabajadas: 0,
            totalHorasEsperadas: 0,
          };
        }

        gruposPorMolino[idMolino].iniciales.push({
          fecha_informe_inicial: encendido.fecha_novedad,
          turno_informe_inicial: encendido.turno_novedad,
          hora_informe_inicial: encendido.hora_novedad,
          molino_informe_inicial: encendido.molino_novedad,
          __esDesdeNovedad: true,
        });
      });

      informeFinal
        .filter((registro) => registro.molino_informe_final != null)
        .forEach((registro) => {
          const idMolino = registro.molino_informe_final;

          if (gruposPorMolino[idMolino]) {
            gruposPorMolino[idMolino].finales.push(registro);
          }
        });

      const novedadesParo = novedades
        .filter((novedad) => novedad.tipo_novedad === "Paro")
        .map((novedad) => {
          if (!novedad.fin_paro_novedad) {
            const turnoRelacionado = turno.find(
              (t) => t.nombre_turno === novedad.turno_novedad,
            );

            if (turnoRelacionado) {
              return {
                ...novedad,
                fin_paro_novedad: turnoRelacionado.fin_turno,
              };
            }
          }

          return novedad;
        });

      novedadesParo.forEach((novedad) => {
        const idMolino = novedad.molino_novedad;

        if (gruposPorMolino[idMolino]) {
          gruposPorMolino[idMolino].paros.push(novedad);
        }
      });

      for (const idMolino in gruposPorMolino) {
        const grupo = gruposPorMolino[idMolino];

        const emparejamientos = [];

        let totalHorasMolino = 0;
        let totalHorasParo = 0;
        let horasEsperadasAcumuladas = 0;

        grupo.iniciales.forEach((inicial) => {
          const finalMatch = grupo.finales.find(
            (final) =>
              final.fecha_informe_final === inicial.fecha_informe_inicial &&
              final.turno_informe_final === inicial.turno_informe_inicial,
          );

          if (finalMatch) {
            let inicioDateTime = new Date(
              `${inicial.fecha_informe_inicial}T${inicial.hora_informe_inicial}`,
            );
            let finDateTime = new Date(
              `${finalMatch.fecha_informe_final}T${finalMatch.hora_informe_final}`,
            );

            if (
              finDateTime.getHours() < inicioDateTime.getHours() ||
              (finDateTime.getHours() === inicioDateTime.getHours() &&
                finDateTime.getMinutes() < inicioDateTime.getMinutes()) ||
              (finDateTime.getHours() === inicioDateTime.getHours() &&
                finDateTime.getMinutes() === inicioDateTime.getMinutes() &&
                finDateTime.getSeconds() < inicioDateTime.getSeconds())
            ) {
              finDateTime.setDate(finDateTime.getDate() + 1);
            }
            if (
              isNaN(inicioDateTime.getTime()) ||
              isNaN(finDateTime.getTime())
            ) {
              console.warn(
                `Fechas inválidas para el cálculo de duración en molino ${idMolino}. Inicio: ${inicial.fecha_informe_inicial}T${inicial.hora_informe_inicial}, Fin: ${finalMatch.fecha_informe_final}T${finalMatch.hora_informe_final}`,
              );

              return;
            }

            const duracionMilisegundos =
              finDateTime.getTime() - inicioDateTime.getTime();

            const duracionHoras = duracionMilisegundos / (1000 * 60 * 60);

            emparejamientos.push({
              fecha: inicial.fecha_informe_inicial,
              turno: inicial.turno_informe_inicial,
              horaInicio: inicial.hora_informe_inicial,
              horaFin: finalMatch.hora_informe_final,
              duracion: duracionHoras.toFixed(2),
              paros: [],
            });

            totalHorasMolino += duracionHoras;
          }

          const turnoAsociado = turno.find(
            (t) => t.nombre_turno === inicial.turno_informe_inicial,
          );

          if (turnoAsociado) {
            const duracionEsperadaTurno = calculateTurnoDuration(
              turnoAsociado.inicio_turno,
              turnoAsociado.fin_turno,
            );

            horasEsperadasAcumuladas += duracionEsperadaTurno;
          } else {
            console.warn(
              `Turno '${inicial.turno_informe_inicial}' no encontrado para molino ${idMolino}.`,
            );
          }
        });

        grupo.paros.forEach((paro) => {
          let inicioParoDateTime = new Date(
            `${paro.fecha_novedad}T${paro.inicio_paro_novedad}`,
          );
          let finParoDateTime = new Date(
            `${paro.fecha_novedad}T${paro.fin_paro_novedad}`,
          );

          if (
            finParoDateTime.getHours() < inicioParoDateTime.getHours() ||
            (finParoDateTime.getHours() === inicioParoDateTime.getHours() &&
              finParoDateTime.getMinutes() < inicioParoDateTime.getMinutes()) ||
            (finParoDateTime.getHours() === inicioParoDateTime.getHours() &&
              finParoDateTime.getMinutes() ===
                inicioParoDateTime.getMinutes() &&
              finParoDateTime.getSeconds() < inicioParoDateTime.getSeconds())
          ) {
            finParoDateTime.setDate(finParoDateTime.getDate() + 1);
          }

          if (
            isNaN(inicioParoDateTime.getTime()) ||
            isNaN(finParoDateTime.getTime())
          ) {
            console.warn(
              `Fechas de paro inválidas para el molino ${idMolino}. Inicio: ${paro.fecha_novedad}T${paro.inicio_paro_novedad}, Fin: ${paro.fecha_novedad}T${paro.fin_paro_novedad}`,
            );

            return;
          }

          if (finParoDateTime > inicioParoDateTime) {
            const duracionParoMilisegundos =
              finParoDateTime.getTime() - inicioParoDateTime.getTime();

            totalHorasParo += duracionParoMilisegundos / (1000 * 60 * 60);
          } else {
            console.warn(
              `Fin de paro anterior o igual al inicio para el molino ${idMolino}. Inicio: ${paro.fecha_novedad}T${paro.inicio_paro_novedad}, Fin: ${paro.fecha_novedad}T${paro.fin_paro_novedad}`,
            );
          }
        });

        grupo.emparejamientos = emparejamientos;

        grupo.totalHorasTrabajadas = (
          totalHorasMolino - totalHorasParo
        ).toFixed(2);

        grupo.totalHorasEsperadas = horasEsperadasAcumuladas.toFixed(2);
      }

      setGruposPorMolino(gruposPorMolino);
    };

    groupData();
  }, [item, turno]);

  useEffect(() => {
    if (tablaRef.current) {
      registrarTabla("horas", tablaRef.current.outerHTML);
    }
  }, [gruposPorMolino, molino]);

  function convertirHorasDecimalAHorasMinutos(horasDecimal) {
    const horas = Math.floor(horasDecimal);

    const minutos = Math.round((horasDecimal - horas) * 60);

    return `${horas}:${minutos.toString().padStart(2, "0")} Hrs`;
  }

  return (
    <>
      {item ? (
        <>
          <motion.table
            ref={tablaRef}
            className={`${Style.monitoringListHoursTable} table`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <caption>
              <h2>Horas trabajadas</h2>
            </caption>
            <thead
              className={`${Style.monitoringListHoursTableHead} tableHead`}
            >
              <tr>
                <th>Molino</th>
                <th>Horas trabajadas</th>
                <th>Horas de trabajo esperadas</th>
                <th>Horas no trabajadas</th>
              </tr>
            </thead>
            <tbody
              className={`${Style.monitoringListHoursTableBody} tableBody`}
            >
              {molino.map((molinoData) => (
                <tr key={molinoData.id_molino}>
                  <td>{molinoData.nombre_molino}</td>
                  <td>
                    {gruposPorMolino[molinoData.nombre_molino]
                      ? convertirHorasDecimalAHorasMinutos(
                          parseFloat(
                            gruposPorMolino[molinoData.nombre_molino]
                              .totalHorasTrabajadas,
                          ),
                        )
                      : "00:00"}
                  </td>
                  <td>
                    {gruposPorMolino[molinoData.nombre_molino]
                      ? convertirHorasDecimalAHorasMinutos(
                          parseFloat(
                            gruposPorMolino[molinoData.nombre_molino]
                              .totalHorasEsperadas,
                          ),
                        )
                      : "00:00"}
                  </td>
                  <td>
                    {gruposPorMolino[molinoData.nombre_molino]
                      ? convertirHorasDecimalAHorasMinutos(
                          parseFloat(
                            gruposPorMolino[molinoData.nombre_molino]
                              .totalHorasEsperadas,
                          ) -
                            parseFloat(
                              gruposPorMolino[molinoData.nombre_molino]
                                .totalHorasTrabajadas,
                            ),
                        )
                      : "00:00"}
                  </td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        </>
      ) : (
        <motion.div
          className={Style.monitoringListHoursAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.div>
      )}
    </>
  );
}

export default MonitoringListHours;
