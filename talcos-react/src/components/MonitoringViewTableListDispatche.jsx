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

MonitoringViewTableListDispatche.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringViewTableListDispatche({ inicio, fin }) {
  const [despachoProgramado, setDespachoProgramado] = useState([]);
  const [despacho, setDespacho] = useState([]);
  const [allWeeksInPeriod, setAllWeeksInPeriod] = useState([]);
  const [dataPorSemana, setDataPorSemana] = useState({
    programados: {},
    reales: {},
  });
  const [weekRanges, setWeekRanges] = useState({});
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (!inicio || !fin) return;

    const getData = async () => {
      try {
        // noinspection HttpUrlsUsage
        const responseProgrammedDispatche = await axios.get(
          `http://${localIP}:3000/despachos_comerciales/filtrados`,
          {
            params: { inicio, fin },
          },
        );

        // noinspection HttpUrlsUsage
        const responseDispatche = await axios.get(
          `http://${localIP}:3000/despachos/filtrados`,
          {
            params: { inicio, fin },
          },
        );

        setDespachoProgramado(responseProgrammedDispatche.data);
        setDespacho(responseDispatche.data);
      } catch (error) {
        console.error("Error al obtener los datos de despachos: ", error);
      }
    };

    void getData();
  }, [localIP, inicio, fin]);

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
    if (!allWeeksInPeriod.length) return;

    const getWeekNumberISO = (date) => {
      return getWeek(date, {
        weekStartsOn: 1,
        firstWeekContainsDate: 4,
      });
    };

    const groupDispatchesByWeek = () => {
      const groupedProgramados = {};
      const groupedReales = {};

      allWeeksInPeriod.forEach((weekNum) => {
        groupedProgramados[weekNum] = [];
        groupedReales[weekNum] = [];
      });

      despachoProgramado.forEach((item) => {
        const date = parseISO(item.fecha_despacho_comercial);
        const weekNumber = getWeekNumberISO(date);

        if (groupedProgramados[weekNumber]) {
          groupedProgramados[weekNumber].push(item);
        }
      });

      despacho.forEach((item) => {
        const date = parseISO(item.fecha_despacho);
        const weekNumber = getWeekNumberISO(date);

        if (groupedReales[weekNumber]) {
          groupedReales[weekNumber].push(item);
        }
      });

      setDataPorSemana({
        programados: groupedProgramados,
        reales: groupedReales,
      });
    };

    groupDispatchesByWeek();
  }, [allWeeksInPeriod, despachoProgramado, despacho]);

  return (
    <motion.table
      className={Style.monitoringViewTableListEfficiencyTable}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <caption>
        <h2>Despachos programados y realizados por semana</h2>
      </caption>
      <thead className={Style.monitoringViewTableListEfficiencyTableHead}>
        <tr>
          <th>Categoria</th>
          {allWeeksInPeriod.map((weekNum) => (
            <th key={`th-week-${weekNum}`} title={weekRanges[weekNum]?.label}>
              Semana {weekNum}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={Style.monitoringViewTableListEfficiencyTableBody}>
        <tr>
          <td>Programados</td>
          {allWeeksInPeriod.map((weekNum) => {
            const totalCantidadProgramada = dataPorSemana.programados[weekNum]
              ? dataPorSemana.programados[weekNum].reduce(
                  (sum, item) => sum + (item.cantidad_despacho_comercial || 0),
                  0,
                )
              : 0;
            return (
              <td key={`programados-${weekNum}`}>{totalCantidadProgramada}</td>
            );
          })}
        </tr>
        <tr>
          <td>Realizados</td>
          {allWeeksInPeriod.map((weekNum) => {
            const totalCantidadRealizada = dataPorSemana.reales[weekNum]
              ? dataPorSemana.reales[weekNum].reduce(
                  (sum, item) => sum + (item.cantidad_despacho || 0),
                  0,
                )
              : 0;
            return <td key={`reales-${weekNum}`}>{totalCantidadRealizada}</td>;
          })}
        </tr>
      </tbody>
      <tfoot className={Style.monitoringViewTableListEfficiencyTableFooter}>
        <tr>
          <td>Desviación</td>
          {allWeeksInPeriod.map((weekNum) => {
            const totalProgramados = dataPorSemana.programados[weekNum]
              ? dataPorSemana.programados[weekNum].reduce(
                  (sum, item) => sum + (item.cantidad_despacho_comercial || 0),
                  0,
                )
              : 0;
            const totalReales = dataPorSemana.reales[weekNum]
              ? dataPorSemana.reales[weekNum].reduce(
                  (sum, item) => sum + (item.cantidad_despacho || 0),
                  0,
                )
              : 0;
            const deviation = totalReales - totalProgramados;
            return <td key={`desviacion-${weekNum}`}>{deviation}</td>;
          })}
        </tr>
      </tfoot>
    </motion.table>
  );
}

export default MonitoringViewTableListDispatche;
