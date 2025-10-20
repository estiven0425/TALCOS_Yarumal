import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { obtenerTodasLasTablas } from "../utils/tablaStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import axios from "axios";
import MonitoringList from "./MonitoringList";

import Style from "./styles/monitoring-action.module.css";

function MonitoringAction() {
  const [inicioMonitoreo, setInicioMonitoreo] = useState("");
  const [finMonitoreo, setFinMonitoreo] = useState("");
  const [selectedItem, setSelectedItem] = useState({});
  const [sendStatus, setSendStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState({});
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  const validation = () => {
    const errors = {};

    if (!inicioMonitoreo.trim()) {
      errors.inicioMonitoreo = "La fecha de inicio es obligatoria.";
    }
    if (!finMonitoreo.trim()) {
      errors.finMonitoreo = "La fecha de fin es obligatoria.";
    }
    if (finMonitoreo && new Date(finMonitoreo) < new Date(inicioMonitoreo)) {
      errors.finMonitoreo = "La fecha de fin debe ser mayor que la de inicio.";
    }

    setValidationError(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setSelectedItem({
      inicioMonitoreo: inicioMonitoreo,
      finMonitoreo: finMonitoreo,
    });
    setSendStatus(true);
  };

  const printItem = async (e) => {
    e.preventDefault();

    const currentTablas = obtenerTodasLasTablas();

    const formatDate = (date) => {
      const isoDateString = date instanceof Date ? date.toISOString() : date;

      const formattedDate = format(
        parseISO(isoDateString),
        "EEEE dd 'de' MMMM 'del' yyyy",
        {
          locale: es,
        },
      );

      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    };

    const content = `
    <style>
      .aside {
        align-content: flex-start;
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 10%;
        justify-content: center;
        width: 100%;
      }

      .aside div {
        align-content: flex-start;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        gap: 5px;
        justify-content: flex-start;
        width: 30%;
      }

      .aside div h2 {
        color: #696a9e;
        font-size: 1rem;
        margin: 0;
        text-align: left;
      }

      .aside div p {
        font-size: 1rem;
        margin: 0;
        text-align: left;
      }

      .aside .asideSpecial {
        width: 70%;
      }

      .article {
        align-content: stretch;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-wrap: nowrap;
        justify-content: flex-start;
        page-break-inside: avoid;
        width: 100%;
      }

      .article h2 {
        color: #696a9e;
        font-size: 1rem;
        margin: 0;
        text-align: center;
      }

      .table {
        border-collapse: collapse;
        page-break-inside: avoid;
        width: 100%;
      }

      .table caption h2 {
        color: #696a9e;
        font-size: 1rem;
        margin: 0;
      }

      .table caption span {
        font-size: 1rem;
        margin: 0;
      }

      .tableHead,
      .tableBody,
      .tableFooter {
        width: 100%;
      }

      .tableHead tr,
      .tableBody tr,
      .tableFooter tr {
        page-break-inside: avoid;
        width: 100%;
      }
        
      .tableHead tr {
        background-color: #696a9e;
        color: #ffffff;
      }
        
      .tableHead tr th {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableBody tr:nth-child(odd) {
        color: #000000;
        background-color: #a4adc5;
      }
        
      .tableBody tr:nth-child(even) {
        color: #000000;
        background-color: #9097b7;
      }

      .tableBody tr th {
        background-color: #696a9e;
        color: #ffffff;
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableBody tr td {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }

      .tableFooter tr th {
        vertical-align: baseline;
        text-align: center;
      }

      .tableFooter tr td {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: auto;
      }
    </style>
    <aside class="aside">
      <div>
        <h2>Fecha del monitoreo inicial</h2>
        <p>${formatDate(inicioMonitoreo)}</p>
      </div>
      <div>
        <h2>Fecha del monitoreo final</h2>
        <p>${formatDate(finMonitoreo)}</p>
      </div>
    </aside>
  ${Object.values(currentTablas)
    .join("")
    .replace(/style="[^"]*opacity:\s*0;?[^"]*"/g, "")}
    `;

    try {
      setLoading(true);

      // noinspection HttpUrlsUsage
      const response = await axios.post(
        `http://${localIP}:3000/pdf`,
        {
          titulo: `Monitoreo de datos`,
          contenido: content,
          nombre: "Monitoreo de datos",
        },
        {
          responseType: "blob",
        },
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" }),
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = "monitoreo_de_datos.pdf";

      document.body.appendChild(a);

      a.click();

      document.body.removeChild(a);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log("Error al imprimir: ", error);
    }
  };

  const redirectView = () => {
    navigate("/monitoring/viewmonitoring");
  };

  return (
    <>
      <motion.section
        className={Style.monitoringActionPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MonitoringList
          inicioMonitoreo={selectedItem.inicioMonitoreo}
          finMonitoreo={selectedItem.finMonitoreo}
        />
      </motion.section>
      <motion.section
        className={Style.monitoringActionSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.header className={Style.monitoringActionHeader}>
          <h2>Establezca una fecha para realizar el monitoreo</h2>
        </motion.header>
        <motion.main className={Style.monitoringActionMain}>
          <form
            className={Style.monitoringActionMainForm}
            onSubmit={handleSubmit}
          >
            <fieldset>
              <label htmlFor="inicioMonitoreo">Desde:</label>
              <input
                id="inicioMonitoreo"
                name="inicioMonitoreo"
                onChange={(e) => setInicioMonitoreo(e.target.value)}
                type="date"
                value={inicioMonitoreo}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="finMonitoreo">Hasta:</label>
              <input
                id="finMonitoreo"
                name="finMonitoreo"
                onChange={(e) => setFinMonitoreo(e.target.value)}
                type="date"
                value={finMonitoreo}
              />
            </fieldset>
            <button type="submit">Buscar</button>
            {validationError.inicioMonitoreo && (
              <motion.span
                className={Style.monitoringActionMainValidation}
                initial={{ zoom: 0 }}
                animate={{ zoom: 1 }}
                transition={{ duration: 0.5 }}
              >
                {validationError.inicioMonitoreo}
              </motion.span>
            )}
            {validationError.finMonitoreo && (
              <motion.span
                className={Style.monitoringActionMainValidation}
                initial={{ zoom: 0 }}
                animate={{ zoom: 1 }}
                transition={{ duration: 0.5 }}
              >
                {validationError.finMonitoreo}
              </motion.span>
            )}
          </form>
        </motion.main>
        <motion.footer className={Style.monitoringActionFooter}>
          <button onClick={() => redirectView()} type="button">
            Vista semanal
          </button>
          <button disabled={!sendStatus} onClick={printItem} type="button">
            {loading ? (
              <div className={Style.loader}></div>
            ) : (
              "Imprimir monitoreo"
            )}
          </button>
        </motion.footer>
      </motion.section>
    </>
  );
}

export default MonitoringAction;
