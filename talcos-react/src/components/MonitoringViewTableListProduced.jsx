// noinspection JSUnusedLocalSymbols

import {
  eachWeekOfInterval,
  endOfWeek,
  format,
  getWeek,
  parseISO,
} from "date-fns";
import { motion } from "framer-motion";
import { registrarTabla } from "../utils/tablaStore";
import { useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";
import PropTypes from "prop-types";

import Style from "./styles/monitoring-view-table-list-produced.module.css";

MonitoringViewTableListProduced.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringViewTableListProduced({ inicio, fin }) {
  const [referencia, setReferencia] = useState([]);
  const [item, setItem] = useState(null);
  const [finalReport, setFinalReport] = useState([]);
  const [allWeeksInPeriod, setAllWeeksInPeriod] = useState([]);
  const [weekRanges, setWeekRanges] = useState({});
  const [dataPorReferenciaPorSemana, setDataPorReferenciaPorSemana] = useState(
    {},
  );
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
        const responseReference = await axios.get(
          `http://${localIP}:3000/referencias`,
        );

        setItem(responseMonitoring.data);
        setReferencia(responseReference.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getData();
  }, [localIP, inicio, fin]);

  useEffect(() => {
    if (!item) return;

    const endReport = item.informeFinal;

    setFinalReport(endReport);
  }, [localIP, item]);

  useEffect(() => {
    if (!inicio || !fin) return;

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
      setAllWeeksInPeriod(uniqueWeeks);

      return uniqueWeeks;
    };

    getAllWeeksInDateRange(inicio, fin);
  }, [inicio, fin]);

  useEffect(() => {
    if (!referencia.length || !allWeeksInPeriod.length || !inicio || !fin) {
      return;
    }

    const getWeekNumberISO = (date) => {
      return getWeek(date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      });
    };

    const groupDataByWeekAndReference = () => {
      const currentWeeksInPeriod = allWeeksInPeriod;

      const dataAgrupada = {};

      referencia.forEach((ref) => {
        const nombreReferencia = ref.nombre_referencia;

        dataAgrupada[nombreReferencia] = {};

        currentWeeksInPeriod.forEach((weekNum) => {
          dataAgrupada[nombreReferencia][weekNum] = 0;
        });
      });

      if (finalReport.length > 0) {
        finalReport.forEach((entry) => {
          const referenciaName = entry.referencia_informe_final;
          const fecha = entry.fecha_informe_final;

          const cantidad = Number(entry.cantidad_informe_final);

          if (!referenciaName || !fecha) return;

          const date = parseISO(fecha);

          const weekNumber = getWeekNumberISO(date);

          if (
            dataAgrupada[referenciaName] &&
            dataAgrupada[referenciaName][weekNumber] !== undefined
          ) {
            dataAgrupada[referenciaName][weekNumber] += cantidad;
          }
        });
      }

      setDataPorReferenciaPorSemana(dataAgrupada);
    };

    groupDataByWeekAndReference();
  }, [finalReport, referencia, allWeeksInPeriod, inicio, fin]);

  const weeklyTotals = useMemo(() => {
    const totals = {};

    allWeeksInPeriod.forEach((weekNum) => {
      totals[weekNum] = 0;

      Object.values(dataPorReferenciaPorSemana).forEach((semanas) => {
        totals[weekNum] += semanas[weekNum] || 0;
      });
    });

    return totals;
  }, [dataPorReferenciaPorSemana, allWeeksInPeriod]);

  useEffect(() => {
    if (
      tablaRef.current &&
      Object.keys(dataPorReferenciaPorSemana).length > 0
    ) {
      registrarTabla("producidos", tablaRef.current.outerHTML);
    }
  }, [dataPorReferenciaPorSemana]);

  // noinspection JSUnresolvedReference
  return (
    <>
      {item ? (
        <>
          <motion.article
            ref={tablaRef}
            className={Style.monitoringViewTableListProduced}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.table
              className={Style.monitoringViewTableListProducedTable}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <caption>
                <h2>Producción por referencia en toneladas</h2>
              </caption>
              <thead className={Style.monitoringViewTableListProducedTableHead}>
                <tr>
                  <th>Referencia</th>
                  {allWeeksInPeriod.map((weekNum) => (
                    <th
                      key={`th-week-${weekNum}`}
                      title={weekRanges[weekNum]?.label}
                    >
                      Semana {weekNum}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={Style.monitoringViewTableListProducedTableBody}>
                {referencia.map((ref) => {
                  // eslint-disable-next-line
                  const totalPorReferencia = allWeeksInPeriod.reduce(
                    (total, weekNum) => {
                      return (
                        total +
                        (dataPorReferenciaPorSemana[ref.nombre_referencia]?.[
                          weekNum
                        ] || 0)
                      );
                    },
                    0,
                  );

                  return (
                    <tr key={ref.id_referencia}>
                      <td>{ref.nombre_referencia}</td>
                      {allWeeksInPeriod.map((weekNum) => {
                        const cantidad =
                          dataPorReferenciaPorSemana[ref.nombre_referencia]?.[
                            weekNum
                          ] || 0;
                        return (
                          <td key={`${ref.nombre_referencia}-week-${weekNum}`}>
                            {parseFloat(cantidad).toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
              <tfoot
                className={Style.monitoringViewTableListProducedTableFooter}
              >
                <tr>
                  <td>Total general</td>
                  {allWeeksInPeriod.map((weekNum) => (
                    <td key={`total-week-${weekNum}`}>
                      {parseFloat(weeklyTotals[weekNum] || 0).toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tfoot>
            </motion.table>
          </motion.article>
        </>
      ) : (
        <motion.div
          className={Style.monitoringViewTableListProducedAlternative}
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

export default MonitoringViewTableListProduced;
