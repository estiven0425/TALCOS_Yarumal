import { es } from "date-fns/locale";
import { format, parseISO, set } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import ReportAction from "./ReportAction";
import Style from "./styles/report-List.module.css";

function ReportList() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedKey, setSelectedKey] = useState(null);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItems = async () => {
      try {
        const responseStartReport = await axios.get(
          `http://${localIP}:3000/informes_iniciales`
        );
        const responseNews = await axios.get(
          `http://${localIP}:3000/novedades`
        );
        const responseQualityControl = await axios.get(
          `http://${localIP}:3000/controles_calidad`
        );
        const responseEndReport = await axios.get(
          `http://${localIP}:3000/informes_finales`
        );

        const groupedInformesIniciales = responseStartReport.data.reduce(
          (groups, item) => {
            const key = `${item.fecha_informe_inicial}/${item.turno_informe_inicial}`;
            if (!groups[key]) {
              groups[key] = [];
            }
            groups[key].push(item);
            return groups;
          },
          {}
        );
        const groupedNovedades = responseNews.data.reduce((groups, item) => {
          const key = `${item.fecha_novedad}/${item.turno_novedad}`;
          if (!groups[key]) {
            groups[key] = [];
          }
          groups[key].push(item);
          return groups;
        }, {});
        const groupedControlCalidad = responseQualityControl.data.reduce(
          (groups, item) => {
            const key = `${item.fecha_control_calidad}/${item.turno_control_calidad}`;
            if (!groups[key]) {
              groups[key] = [];
            }
            groups[key].push(item);
            return groups;
          },
          {}
        );
        const groupedInformesFinales = responseEndReport.data.reduce(
          (groups, item) => {
            const key = `${item.fecha_informe_final}/${item.turno_informe_final}`;
            if (!groups[key]) {
              groups[key] = [];
            }
            groups[key].push(item);
            return groups;
          },
          {}
        );
        const combinedGroups = {};
        const allKeys = new Set([
          ...Object.keys(groupedInformesIniciales),
          ...Object.keys(groupedNovedades),
          ...Object.keys(groupedControlCalidad),
          ...Object.keys(groupedInformesFinales),
        ]);

        allKeys.forEach((key) => {
          combinedGroups[key] = {
            informesIniciales: groupedInformesIniciales[key] || [],
            novedades: groupedNovedades[key] || [],
            controlesCalidad: groupedControlCalidad[key] || [],
            informesFinales: groupedInformesFinales[key] || [],
          };
        });

        setItems(combinedGroups);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getItems();
  }, [localIP]);

  const handleButtonClick = (key, record) => {
    if (selectedKey === key) {
      setSelectedKey(null);
      setSelectedItem(null);
    } else {
      setSelectedKey(key);
      setSelectedItem(record);
    }
  };

  const formatDate = (date) => {
    const formattedDate = format(
      parseISO(date),
      "EEEE dd 'de' MMMM 'del' yyyy",
      {
        locale: es,
      }
    );
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  const uniqueDates = Object.keys(items)
    .map((key) => key.split("/")[0])
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort((a, b) => new Date(b) - new Date(a));

  return (
    <>
      {Object.keys(items).length > 0 ? (
        <motion.section
          className={Style.reportListPrimary}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {uniqueDates.map((date) => (
            <article key={date}>
              <section className={Style.reportListPrimaryDate}>
                <h2>{formatDate(date)}</h2>
              </section>
              <section className={Style.reportListPrimaryobject}>
                {Object.entries(items)
                  .filter(([key]) => key.startsWith(`${date}/`))
                  .map(([key, combinedData]) => {
                    const turno = key.split("/")[1];
                    const allRecords = [
                      ...combinedData.informesIniciales,
                      ...combinedData.novedades,
                      ...combinedData.controlesCalidad,
                      ...combinedData.informesFinales,
                    ];

                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleButtonClick(key, allRecords)}
                      >
                        <h2>{turno}</h2>
                        <img alt="Informe" src="/doc.svg" />
                      </button>
                    );
                  })}
              </section>
            </article>
          ))}
        </motion.section>
      ) : (
        <motion.section
          className={Style.reportListPrimaryAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen informes</h2>
        </motion.section>
      )}
      <motion.section
        className={Style.reportListSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ReportAction item={selectedItem} />
      </motion.section>
    </>
  );
}

export default ReportList;
