import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { registrarTabla } from "../utils/tablaStore";
import axios from "axios";
import PropTypes from "prop-types";
import Style from "./styles/monitoring-list-produced.module.css";

MonitoringListProduced.propTypes = {
  inicio: PropTypes.any,
  fin: PropTypes.any,
};

function MonitoringListProduced({ inicio, fin }) {
  const [molino, setMolino] = useState([]);
  const [referencia, setReferencia] = useState([]);
  const [bulto, setBulto] = useState([]);
  const [item, setItem] = useState(null);
  const [finalReport, setFinalReport] = useState([]);
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
        const responseReference = await axios.get(
          `http://${localIP}:3000/referencias`,
        );

        // noinspection HttpUrlsUsage
        const responseBulk = await axios.get(`http://${localIP}:3000/bultos`);

        setItem(responseMonitoring.data);
        setMolino(responseWindmill.data);
        setReferencia(responseReference.data);
        setBulto(responseBulk.data);
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

  const groupedData = useMemo(() => {
    const result = {};
    const totalPerRow = {};
    const totalPerColumn = {};

    finalReport.forEach((entry) => {
      const molino = entry.molino_informe_final;
      const referencia = entry.referencia_informe_final;
      const bulto = entry.bulto_informe_final;
      const cantidad = Number(entry.cantidad_informe_final);

      if (!result[molino]) result[molino] = {};
      if (!result[molino][referencia]) result[molino][referencia] = {};
      if (!result[molino][referencia][bulto])
        result[molino][referencia][bulto] = 0;

      result[molino][referencia][bulto] += cantidad;

      if (!totalPerRow[molino]) totalPerRow[molino] = {};
      if (!totalPerRow[molino][referencia]) totalPerRow[molino][referencia] = 0;

      totalPerRow[molino][referencia] += cantidad;

      if (!totalPerColumn[molino]) totalPerColumn[molino] = {};
      if (!totalPerColumn[molino][bulto]) totalPerColumn[molino][bulto] = 0;

      totalPerColumn[molino][bulto] += cantidad;
    });

    return { result, totalPerRow, totalPerColumn };
  }, [finalReport]);

  useEffect(() => {
    if (tablaRef.current) {
      registrarTabla("producidos", tablaRef.current.outerHTML);
    }
  }, [finalReport, molino]);

  // noinspection JSValidateTypes
  return (
    <>
      {item ? (
        <>
          <motion.article
            ref={tablaRef}
            className={`${Style.monitoringListProduced} article`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Toneladas producidas</h2>
            {molino.map((molino) => (
              <motion.table
                className={`${Style.monitoringListProducedTable} table`}
                key={molino.id_molino}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <caption>
                  <h2>{molino.nombre_molino}</h2>
                </caption>
                <thead
                  className={`${Style.monitoringListProducedTableHead} tableHead`}
                >
                  <tr>
                    <th>referencia</th>
                    {bulto.map((bulto) => (
                      <th key={bulto.id_bulto}>{bulto.nombre_bulto}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody
                  className={`${Style.monitoringListProducedTableBody} tableBody`}
                >
                  {referencia.map((ref) => (
                    <tr key={ref.id_referencia}>
                      <td>{ref.nombre_referencia}</td>
                      {bulto.map((bul) => {
                        const cantidad =
                          groupedData.result[molino.nombre_molino]?.[
                            ref.nombre_referencia
                          ]?.[bul.nombre_bulto] ?? 0;
                        return (
                          <td key={bul.id_bulto}>
                            {parseFloat(cantidad).toFixed(2)} Tons
                          </td>
                        );
                      })}
                      <td>
                        {parseFloat(
                          groupedData.totalPerRow[molino.nombre_molino]?.[
                            ref.nombre_referencia
                          ] ?? 0,
                        ).toFixed(2)}{" "}
                        Tons
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot
                  className={`${Style.monitoringListProducedTableFooter} tableFooter`}
                >
                  <tr>
                    <th>Total</th>
                    {bulto.map((bul) => {
                      const total =
                        groupedData.totalPerColumn[molino.nombre_molino]?.[
                          bul.nombre_bulto
                        ] ?? 0;
                      return (
                        <td key={bul.id_bulto}>
                          {parseFloat(total).toFixed(2)} Tons
                        </td>
                      );
                    })}
                    <td>
                      {(() => {
                        const total = referencia.reduce((acc, ref) => {
                          const t =
                            groupedData.totalPerRow[molino.nombre_molino]?.[
                              ref.nombre_referencia
                            ] ?? 0;
                          return acc + t;
                        }, 0);
                        return parseFloat(total).toFixed(2) + " Tons";
                      })()}
                    </td>
                  </tr>
                </tfoot>
              </motion.table>
            ))}
          </motion.article>
        </>
      ) : (
        <motion.div
          className={Style.monitoringListProducedAlternative}
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

export default MonitoringListProduced;
