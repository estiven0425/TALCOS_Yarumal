import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { registrarTabla } from "../utils/tablaStore";
import axios from "axios";
import PropTypes from "prop-types";
import Style from "./styles/monitoring-list-efficiency.module.css";

MonitoringListEfficiency.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringListEfficiency({ inicio, fin }) {
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
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

        // noinspection HttpUrlsUsage
        const responseReference = await axios.get(
          `http://${localIP}:3000/referencias`,
        );

        setItem(responseMonitoring.data);
        setMolino(responseWindmill.data);
        setTurno(responseShift.data);
        setReferencia(responseReference.data);
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

    const groupByReference = () => {
      const { informeInicial, informeFinal, novedades } = item;

      const grupos = {};

      referencia.forEach((ref) => {
        const nombreReferencia = ref.nombre_referencia;

        grupos[nombreReferencia] = {};
      });

      informeInicial.forEach((inicial) => {
        const ref = inicial.referencia_informe_inicial;
        const molino = inicial.molino_informe_inicial;

        if (!ref || !molino) return;

        if (!grupos[ref]) grupos[ref] = {};

        if (!grupos[ref][molino]) {
          grupos[ref][molino] = {
            iniciales: [],
            finales: [],
            encendidos: [],
            cambiosReferencia: [],
            paros: [],
            emparejamientos: [],
            totalHorasEsperadas: 0,
            totalHorasTrabajadas: 0,
          };
        }

        grupos[ref][molino].iniciales.push(inicial);
      });

      novedades.forEach((novedad) => {
        if (novedad.tipo_novedad === "Encendido de molino") {
          const { referencia_novedad: ref, molino_novedad: molino } = novedad;

          if (!ref || !molino) return;

          if (!grupos[ref]) grupos[ref] = {};

          if (!grupos[ref][molino]) {
            grupos[ref][molino] = {
              iniciales: [],
              finales: [],
              encendidos: [],
              cambiosReferencia: [],
              paros: [],
              emparejamientos: [],
              totalHorasEsperadas: 0,
              totalHorasTrabajadas: 0,
            };
          }

          grupos[ref][molino].encendidos.push(novedad);
        }
      });

      novedades.forEach((novedad) => {
        if (novedad.tipo_novedad === "Cambio de referencia") {
          const { referencia_novedad: ref, molino_novedad: molino } = novedad;

          if (!ref || !molino) return;

          if (!grupos[ref]) grupos[ref] = {};

          if (!grupos[ref][molino]) {
            grupos[ref][molino] = {
              iniciales: [],
              finales: [],
              encendidos: [],
              cambiosReferencia: [],
              paros: [],
              emparejamientos: [],
              totalHorasEsperadas: 0,
              totalHorasTrabajadas: 0,
            };
          }

          grupos[ref][molino].cambiosReferencia.push(novedad);
        }
      });

      const novedadesParo = novedades
        .filter((n) => n.tipo_novedad === "Paro")
        .map((paro) => {
          if (!paro.fin_paro_novedad) {
            const turnoRelacionado = turno.find(
              (t) => t.nombre_turno === paro.turno_novedad,
            );

            if (turnoRelacionado) {
              return {
                ...paro,
                fin_paro_novedad: turnoRelacionado.fin_turno,
              };
            }
          }

          return paro;
        });

      novedadesParo.forEach((paro) => {
        const molino = paro.molino_novedad;
        const ref = paro.referencia_novedad;

        if (!molino || !ref || !grupos[ref] || !grupos[ref][molino]) return;

        grupos[ref][molino].paros.push(paro);
      });

      informeFinal.forEach((final) => {
        const ref = final.referencia_informe_final;
        const molino = final.molino_informe_final;

        if (!ref || !molino) return;

        if (!grupos[ref]) grupos[ref] = {};

        if (!grupos[ref][molino]) {
          grupos[ref][molino] = {
            iniciales: [],
            finales: [],
            encendidos: [],
            cambiosReferencia: [],
            paros: [],
            emparejamientos: [],
            totalHorasEsperadas: 0,
            totalHorasTrabajadas: 0,
          };
        }

        grupos[ref][molino].finales.push(final);
      });

      for (const ref in grupos) {
        for (const molino in grupos[ref]) {
          const grupo = grupos[ref][molino];

          let totalHoras = 0;
          let horasEsperadas = 0;
          let totalToneladas = 0;

          const puntosInicio = [
            ...grupo.iniciales.map((r) => ({ ...r, tipo: "inicial" })),
            ...grupo.encendidos.map((r) => ({
              ...r,
              tipo: "encendido",
              fecha_informe_inicial: r.fecha_novedad,
              hora_informe_inicial: r.hora_novedad,
              turno_informe_inicial: r.turno_novedad,
            })),
            ...grupo.cambiosReferencia.map((r) => ({
              ...r,
              tipo: "cambioReferencia",
              fecha_informe_inicial: r.fecha_novedad,
              hora_informe_inicial: r.hora_novedad,
              turno_informe_inicial: r.turno_novedad,
            })),
          ];

          puntosInicio.forEach((inicial) => {
            const finalMatch = grupo.finales.find(
              (final) =>
                final.fecha_informe_final === inicial.fecha_informe_inicial &&
                final.turno_informe_final === inicial.turno_informe_inicial,
            );

            if (!finalMatch) return;

            const inicio = new Date(
              `${inicial.fecha_informe_inicial}T${inicial.hora_informe_inicial}`,
            );

            const fin = new Date(
              `${finalMatch.fecha_informe_final}T${finalMatch.hora_informe_final}`,
            );

            if (fin < inicio) fin.setDate(fin.getDate() + 1);

            if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) return;

            const duracion = (fin - inicio) / (1000 * 60 * 60);

            totalHoras += duracion;

            const turnoAsociado = turno.find(
              (t) => t.nombre_turno === inicial.turno_informe_inicial,
            );

            if (turnoAsociado) {
              horasEsperadas += calculateTurnoDuration(
                turnoAsociado.inicio_turno,
                turnoAsociado.fin_turno,
              );
            }

            grupo.emparejamientos.push({
              fecha: inicial.fecha_informe_inicial,
              turno: inicial.turno_informe_inicial,
              horaInicio: inicial.hora_informe_inicial,
              horaFin: finalMatch.hora_informe_final,
              duracion: duracion.toFixed(2),
              tipo: inicial.tipo,
            });
          });

          grupo.paros.forEach((paro) => {
            const inicioParo = new Date(
              `${paro.fecha_novedad}T${paro.inicio_paro_novedad}`,
            );

            const finParo = new Date(
              `${paro.fecha_novedad}T${paro.fin_paro_novedad}`,
            );

            if (finParo < inicioParo) finParo.setDate(finParo.getDate() + 1);

            // noinspection JSCheckFunctionSignatures
            if (isNaN(inicioParo) || isNaN(finParo)) return;

            const duracionParo = (finParo - inicioParo) / (1000 * 60 * 60);

            totalHoras -= duracionParo;
          });

          grupo.finales.forEach((final) => {
            const cantidad = parseFloat(final.cantidad_informe_final);

            if (!isNaN(cantidad)) {
              totalToneladas += cantidad;
            }
          });

          grupo.totalHorasTrabajadas = totalHoras.toFixed(2);
          grupo.totalHorasEsperadas = horasEsperadas.toFixed(2);
          grupo.totalToneladas = totalToneladas.toFixed(2);
          grupo.rendimiento =
            grupo.totalHorasTrabajadas > 0
              ? ((totalToneladas * 1000) / grupo.totalHorasTrabajadas).toFixed(
                  2,
                )
              : "0.00";
        }
      }

      setGruposPorMolino(grupos);
    };

    groupByReference();
  }, [item, referencia, turno]);

  useEffect(() => {
    if (tablaRef.current) {
      registrarTabla("eficiencia", tablaRef.current.outerHTML);
    }
  }, [gruposPorMolino, molino]);

  return (
    <>
      {item ? (
        <>
          <motion.table
            ref={tablaRef}
            className={`${Style.monitoringListEfficiencyTable} table`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <caption>
              <h2>Eficiencia y rendimiento</h2>
            </caption>
            <thead
              className={`${Style.monitoringListEfficiencyTableHead} tableHead`}
            >
              <tr>
                <th>Referencia</th>
                <th>Molino</th>
                <th>Eficiencia promedio</th>
                <th>Rendimiento promedio</th>
              </tr>
            </thead>
            <tbody
              className={`${Style.monitoringListEfficiencyTableBody} tableBody`}
            >
              {Object.entries(gruposPorMolino).map(
                ([nombreReferencia, molinos]) => {
                  // noinspection JSCheckFunctionSignatures
                  const molinosArray = Object.entries(molinos);
                  return molinosArray.map(([nombreMolino, dataMolino], idx) => (
                    <tr key={`${nombreReferencia}-${nombreMolino}`}>
                      {idx === 0 && (
                        <td rowSpan={molinosArray.length}>
                          {nombreReferencia}
                        </td>
                      )}
                      <td>{nombreMolino}</td>
                      <td>
                        {dataMolino.totalHorasEsperadas > 0
                          ? `${(
                              (dataMolino.totalHorasTrabajadas /
                                dataMolino.totalHorasEsperadas) *
                              100
                            ).toFixed(1)} %`
                          : "0.0 %"}
                      </td>
                      <td>{dataMolino.rendimiento} Kg/Hr</td>
                    </tr>
                  ));
                },
              )}
            </tbody>
          </motion.table>
        </>
      ) : (
        <motion.div
          className={Style.monitoringListEfficiencyAlternative}
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

export default MonitoringListEfficiency;
