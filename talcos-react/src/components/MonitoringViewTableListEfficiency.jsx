import {
  eachWeekOfInterval,
  endOfWeek,
  format,
  getWeek,
  parseISO,
} from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";
import PropTypes from "prop-types";

import Style from "./styles/monitoring-view-table-list-efficiency.module.css";

MonitoringViewTableListEfficiency.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringViewTableListEfficiency({ inicio, fin }) {
  const [molino, setMolino] = useState([]);
  const [turno, setTurno] = useState([]);
  const [item, setItem] = useState(null);
  const [dataPorMolinoPorSemana, setDataPorMolinoPorSemana] = useState({});
  const [allWeeksInPeriod, setAllWeeksInPeriod] = useState([]);
  const [weeklyAverages, setWeeklyAverages] = useState({});
  const [weekRanges, setWeekRanges] = useState({});
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
    if (!item || turno.length === 0 || molino.length === 0 || !inicio || !fin)
      return;

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

    const getWeekNumberISO = (date) => {
      return getWeek(date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      });
    };

    const getAllWeeksInDateRange = (startDateStr, endDateStr) => {
      const startDate = parseISO(startDateStr);
      const endDate = parseISO(endDateStr);

      const weeks = eachWeekOfInterval(
        { start: startDate, end: endDate },
        { weekStartsOn: 1 },
      );

      const weekNumbers = [];
      const ranges = {};

      weeks.forEach((weekStart) => {
        const weekNumber = getWeekNumberISO(weekStart);

        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });

        weekNumbers.push(weekNumber);

        ranges[weekNumber] = {
          start: format(weekStart, "yyyy-MM-dd"),
          end: format(weekEnd, "yyyy-MM-dd"),
          label: `${format(weekStart, "dd/MM")} - ${format(weekEnd, "dd/MM")}`,
        };
      });

      const uniqueWeeks = [...new Set(weekNumbers)].sort((a, b) => a - b);

      setWeekRanges(ranges);

      return uniqueWeeks;
    };

    const groupDataAndCalculate = () => {
      const { informeInicial, informeFinal, novedades } = item;

      const dataAgrupada = {};
      const weeklyTotals = {};

      const weeksInPeriod = getAllWeeksInDateRange(inicio, fin);

      setAllWeeksInPeriod(weeksInPeriod);

      molino.forEach((m) => {
        const nombreMolino = m.nombre_molino;

        dataAgrupada[nombreMolino] = {};

        weeksInPeriod.forEach((weekNum) => {
          dataAgrupada[nombreMolino][weekNum] = {
            iniciales: [],
            finales: [],
            encendidos: [],
            cambiosReferencia: [],
            paros: [],
            emparejamientos: [],
            totalHorasEsperadas: 0,
            totalHorasTrabajadas: 0,
            totalToneladas: 0,
            eficiencia: "0.0",
            rendimiento: "0.00",
          };

          if (!weeklyTotals[weekNum]) {
            weeklyTotals[weekNum] = {
              totalHorasTrabajadas: 0,
              totalHorasEsperadas: 0,
              totalToneladas: 0,
              molinosConDatos: 0,
            };
          }
        });
      });

      const addDataToWeek = (molinoName, dateStr, type, data) => {
        const date = parseISO(dateStr);

        const weekNumber = getWeekNumberISO(date);

        if (dataAgrupada[molinoName] && dataAgrupada[molinoName][weekNumber]) {
          dataAgrupada[molinoName][weekNumber][type].push(data);
        }
      };

      informeInicial.forEach((inicial) => {
        const molino = inicial.molino_informe_inicial;

        if (!molino) return;
        addDataToWeek(
          molino,
          inicial.fecha_informe_inicial,
          "iniciales",
          inicial,
        );
      });

      novedades.forEach((novedad) => {
        if (novedad.tipo_novedad === "Encendido de molino") {
          const { molino_novedad: molino } = novedad;

          if (!molino) return;

          addDataToWeek(molino, novedad.fecha_novedad, "encendidos", novedad);
        }
      });

      novedades.forEach((novedad) => {
        if (novedad.tipo_novedad === "Cambio de referencia") {
          const { molino_novedad: molino } = novedad;

          if (!molino) return;

          addDataToWeek(
            molino,
            novedad.fecha_novedad,
            "cambiosReferencia",
            novedad,
          );
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

        if (!molino) return;

        addDataToWeek(molino, paro.fecha_novedad, "paros", paro);
      });

      informeFinal.forEach((final) => {
        const molino = final.molino_informe_final;

        if (!molino) return;

        addDataToWeek(molino, final.fecha_informe_final, "finales", final);
      });

      for (const nombreMolino in dataAgrupada) {
        for (const weekNumber of weeksInPeriod) {
          const weekData = dataAgrupada[nombreMolino][weekNumber];

          let totalHoras = 0;
          let horasEsperadas = 0;
          let totalToneladas = 0;

          const puntosInicio = [
            ...weekData.iniciales.map((r) => ({ ...r, tipo: "inicial" })),
            ...weekData.encendidos.map((r) => ({
              ...r,
              tipo: "encendido",
              fecha_informe_inicial: r.fecha_novedad,
              hora_informe_inicial: r.hora_novedad,
              turno_informe_inicial: r.turno_novedad,
            })),
            ...weekData.cambiosReferencia.map((r) => ({
              ...r,
              tipo: "cambioReferencia",
              fecha_informe_inicial: r.fecha_novedad,
              hora_informe_inicial: r.hora_novedad,
              turno_informe_inicial: r.turno_novedad,
            })),
          ];

          puntosInicio.forEach((inicial) => {
            const finalMatch = weekData.finales.find(
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

            weekData.emparejamientos.push({
              fecha: inicial.fecha_informe_inicial,
              turno: inicial.turno_informe_inicial,
              horaInicio: inicial.hora_informe_inicial,
              horaFin: finalMatch.hora_informe_final,
              duracion: duracion.toFixed(2),
              tipo: inicial.tipo,
            });
          });

          weekData.paros.forEach((paro) => {
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

          weekData.finales.forEach((final) => {
            const cantidad = parseFloat(final.cantidad_informe_final);

            if (!isNaN(cantidad)) {
              totalToneladas += cantidad;
            }
          });

          weekData.totalHorasTrabajadas = totalHoras.toFixed(2);
          weekData.totalHorasEsperadas = horasEsperadas.toFixed(2);
          weekData.totalToneladas = totalToneladas.toFixed(2);

          weekData.rendimiento =
            weekData.totalHorasTrabajadas > 0
              ? (
                  (totalToneladas * 1000) /
                  weekData.totalHorasTrabajadas
                ).toFixed(2)
              : "0.00";

          weekData.eficiencia =
            weekData.totalHorasEsperadas > 0
              ? (
                  (weekData.totalHorasTrabajadas /
                    weekData.totalHorasEsperadas) *
                  100
                ).toFixed(1)
              : "0.0";

          if (
            parseFloat(weekData.totalHorasEsperadas) > 0 ||
            parseFloat(weekData.totalHorasTrabajadas) > 0
          ) {
            weeklyTotals[weekNumber].totalHorasTrabajadas += parseFloat(
              weekData.totalHorasTrabajadas,
            );
            weeklyTotals[weekNumber].totalHorasEsperadas += parseFloat(
              weekData.totalHorasEsperadas,
            );
            weeklyTotals[weekNumber].totalToneladas += parseFloat(
              weekData.totalToneladas,
            );
            weeklyTotals[weekNumber].molinosConDatos++;
          }
        }
      }

      const finalWeeklyAverages = {};

      for (const weekNum of weeksInPeriod) {
        const totalData = weeklyTotals[weekNum];

        let avgEfficiency = "0.0";
        let avgRendimiento = "0.00";

        if (totalData.totalHorasEsperadas > 0) {
          avgEfficiency = (
            (totalData.totalHorasTrabajadas / totalData.totalHorasEsperadas) *
            100
          ).toFixed(1);
        }
        if (totalData.totalHorasTrabajadas > 0) {
          avgRendimiento = (
            (totalData.totalToneladas * 1000) /
            totalData.totalHorasTrabajadas
          ).toFixed(2);
        }

        finalWeeklyAverages[weekNum] = {
          eficiencia: avgEfficiency,
          rendimiento: avgRendimiento,
        };
      }

      setDataPorMolinoPorSemana(dataAgrupada);
      setWeeklyAverages(finalWeeklyAverages);
    };

    groupDataAndCalculate();
  }, [item, turno, molino, inicio, fin]);

  return (
    <>
      {item ? (
        <>
          <motion.table
            className={Style.monitoringViewTableListEfficiencyTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <caption>
              <h2>Promedio de eficiencia total por molino</h2>
            </caption>
            <thead className={Style.monitoringViewTableListEfficiencyTableHead}>
              <tr>
                <th>Molino</th>
                {allWeeksInPeriod.map((weekNum) => (
                  <th
                    key={`th-eficiencia-week-${weekNum}`}
                    title={weekRanges[weekNum]?.label}
                  >
                    Semana {weekNum}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={Style.monitoringViewTableListEfficiencyTableBody}>
              {Object.entries(dataPorMolinoPorSemana).map(
                ([nombreMolino, semanas]) => (
                  <tr key={nombreMolino}>
                    <td>{nombreMolino}</td>
                    {allWeeksInPeriod.map((weekNum) => {
                      const dataSemana = semanas[weekNum];
                      return (
                        <td key={`${nombreMolino}-eficiencia-${weekNum}`}>
                          {dataSemana ? `${dataSemana.eficiencia}` : "0.0"}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
            <tfoot
              className={Style.monitoringViewTableListEfficiencyTableFooter}
            >
              <tr>
                <td>Promedio general</td>
                {allWeeksInPeriod.map((weekNum) => (
                  <td key={`total-eficiencia-${weekNum}`}>
                    {weeklyAverages[weekNum]
                      ? `${weeklyAverages[weekNum].eficiencia}`
                      : "0.0"}
                  </td>
                ))}
              </tr>
            </tfoot>
          </motion.table>
          <motion.table
            className={Style.monitoringViewTableListEfficiencyTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <caption>
              <h2>Promedio de rendimiento Kg/Hr total por molino</h2>
            </caption>
            <thead className={Style.monitoringViewTableListEfficiencyTableHead}>
              <tr>
                <th>Molino</th>
                {allWeeksInPeriod.map((weekNum) => (
                  <th
                    key={`th-rendimiento-week-${weekNum}`}
                    title={weekRanges[weekNum]?.label}
                  >
                    Semana {weekNum}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={Style.monitoringViewTableListEfficiencyTableBody}>
              {Object.entries(dataPorMolinoPorSemana).map(
                ([nombreMolino, semanas]) => (
                  <tr key={nombreMolino}>
                    <td>{nombreMolino}</td>
                    {allWeeksInPeriod.map((weekNum) => {
                      const dataSemana = semanas[weekNum];
                      return (
                        <td key={`${nombreMolino}-rendimiento-${weekNum}`}>
                          {dataSemana ? `${dataSemana.rendimiento}` : "0.00"}
                        </td>
                      );
                    })}
                  </tr>
                ),
              )}
            </tbody>
            <tfoot
              className={Style.monitoringViewTableListEfficiencyTableFooter}
            >
              <tr>
                <td>Promedio general</td>
                {allWeeksInPeriod.map((weekNum) => (
                  <td key={`total-rendimiento-${weekNum}`}>
                    {weeklyAverages[weekNum]
                      ? `${weeklyAverages[weekNum].rendimiento}`
                      : "0.00"}
                  </td>
                ))}
              </tr>
            </tfoot>
          </motion.table>
        </>
      ) : (
        <motion.div
          className={Style.monitoringViewTableListEfficiencyAlternative}
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

export default MonitoringViewTableListEfficiency;
