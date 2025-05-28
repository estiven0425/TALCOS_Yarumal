import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/monitoring-list-strike.module.css";

function MonitoringListStrike({ inicio, fin }) {
  const [molino, setMolino] = useState([]);
  const [news, setNews] = useState([]);
  const [newsUpdated, setNewsUpdated] = useState([]);
  const [item, setItem] = useState(null);
  const [parosAgrupados, setParosAgrupados] = useState({});
  const [horasTotalesParo, setHorasTotalesParo] = useState(0);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (!inicio || !fin) return;

    const getData = async () => {
      try {
        const responseMonitoring = await axios.get(
          `http://${localIP}:3000/monitoreo`,
          {
            params: { inicio, fin },
          }
        );
        const responseWindmill = await axios.get(
          `http://${localIP}:3000/molinos`
        );

        setItem(responseMonitoring.data);
        setMolino(responseWindmill.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getData();
  }, [localIP, inicio, fin]);
  useEffect(() => {
    if (!item) return;

    const getShifts = async () => {
      try {
        const responseShift = await axios.get(`http://${localIP}:3000/turnos`);
        const shifts = responseShift.data;
        const novedadesParo = item.novedades.filter(
          (novedad) =>
            novedad.tipo_novedad === "Paro" && !novedad.fin_paro_novedad
        );
        const novedadesActualizadas = novedadesParo.map((novedad) => {
          const turnoEncontrado = shifts.find(
            (shift) => shift.nombre_turno === novedad.turno_novedad
          );

          return {
            ...novedad,
            fin_paro_novedad: turnoEncontrado
              ? turnoEncontrado.fin_turno
              : null,
          };
        });
        const news = item.novedades.filter(
          (novedad) => novedad.tipo_novedad === "Paro"
        );

        setNews(news);

        setNewsUpdated(novedadesActualizadas);
      } catch (error) {
        console.error("Error al obtener los turnos:", error);
      }
    };

    getShifts();
  }, [localIP, item]);
  useEffect(() => {
    if (!item || !molino.length) return;

    const novedadesParo = [...newsUpdated, ...news];

    const parosPorMotivo = novedadesParo.reduce((acc, novedad) => {
      const {
        motivo_paro_novedad,
        molino_novedad,
        inicio_paro_novedad,
        fin_paro_novedad,
        fecha_novedad,
      } = novedad;

      if (!acc[motivo_paro_novedad]) {
        acc[motivo_paro_novedad] = { totalHoras: 0, molinos: {} };
      }

      const fechaInicio = new Date(`${fecha_novedad}T${inicio_paro_novedad}`);
      const fechaFin = fin_paro_novedad
        ? new Date(`${fecha_novedad}T${fin_paro_novedad}`)
        : null;
      const horasParo = fechaFin
        ? (fechaFin - fechaInicio) / (1000 * 60 * 60)
        : 0;

      acc[motivo_paro_novedad].totalHoras += horasParo;

      if (!acc[motivo_paro_novedad].molinos[molino_novedad]) {
        acc[motivo_paro_novedad].molinos[molino_novedad] = 0;
      }

      acc[motivo_paro_novedad].molinos[molino_novedad] += horasParo;

      return acc;
    }, {});

    const horasTotales = Object.values(parosPorMotivo).reduce(
      (sum, motivo) => sum + motivo.totalHoras,
      0
    );

    setHorasTotalesParo(horasTotales);

    const horasTotalesPorMolino = molino.reduce((acc, molinoItem) => {
      acc[molinoItem.nombre_molino] = Object.values(parosPorMotivo).reduce(
        (sum, motivo) => {
          return sum + (motivo.molinos[molinoItem.nombre_molino] || 0);
        },
        0
      );
      return acc;
    }, {});

    Object.keys(parosPorMotivo).forEach((motivo) => {
      parosPorMotivo[motivo].porcentaje = (
        (parosPorMotivo[motivo].totalHoras / horasTotales) *
        100
      ).toFixed(2);
    });

    setParosAgrupados(parosPorMotivo);
    setMolino((prevMolino) =>
      prevMolino.map((m) => ({
        ...m,
        totalHoras: horasTotalesPorMolino[m.nombre_molino],
      }))
    );
  }, [newsUpdated, news]);

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
            className={Style.monitoringListStrikeTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <caption>
              <h2>Paros</h2>
            </caption>
            <thead className={Style.monitoringListStrikeTableHead}>
              <tr>
                <th>Tipo de paro</th>
                <th>Horas de paro</th>
                {molino.map((molino) => (
                  <th key={molino.id_molino}>{molino.nombre_molino}</th>
                ))}
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody className={Style.monitoringListStrikeTableBody}>
              {Object.entries(parosAgrupados).map(([motivo, datos]) => (
                <tr key={motivo}>
                  <td>{motivo}</td>
                  <td>
                    {convertirHorasDecimalAHorasMinutos(datos.totalHoras)}
                  </td>
                  {molino.map((molinoItem) => (
                    <td key={molinoItem.id_molino}>
                      {datos.molinos[molinoItem.nombre_molino]
                        ? convertirHorasDecimalAHorasMinutos(
                            datos.molinos[molinoItem.nombre_molino]
                          )
                        : "0:00 Hrs"}
                    </td>
                  ))}
                  <td>{datos.porcentaje}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot className={Style.monitoringListStrikeTableFooter}>
              <tr>
                <th>Total</th>
                <td>{convertirHorasDecimalAHorasMinutos(horasTotalesParo)}</td>
                {molino.map((molinoItem) => (
                  <td key={molinoItem.id_molino}>
                    {molinoItem.totalHoras
                      ? convertirHorasDecimalAHorasMinutos(
                          molinoItem.totalHoras
                        )
                      : "0:00 Hrs"}
                  </td>
                ))}
                <td> </td>
              </tr>
            </tfoot>
          </motion.table>
        </>
      ) : (
        <motion.div
          className={Style.monitoringListStrikeAlternative}
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

export default MonitoringListStrike;
