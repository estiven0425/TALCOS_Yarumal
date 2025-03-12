import { es } from "date-fns/locale";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-raw-material-register-action-detail.module.css";

function InventoryRawMaterialRegisterActionDetail({ item }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  const sumValues = (records, key) => {
    return records.reduce((total, record) => {
      const keys = key.split(".");
      let value = record;
      keys.forEach((k) => {
        value = value[k];
      });
      return total + parseFloat(value || 0);
    }, 0);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = format(date, "EEEE d 'de' MMMM 'del' yyyy", {
      locale: es,
    });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const printItem = async (e) => {
    e.preventDefault();

    const renderRows = (records) => {
      const renderedProviders = new Set();
      return records.map((record, index) => {
        const showProvider = !renderedProviders.has(
          record.proveedor.nombre_usuario
        );
        if (showProvider) {
          renderedProviders.add(record.proveedor.nombre_usuario);
        }
        return `
          <tr key=${index}>
            <td>${showProvider ? record.proveedor.nombre_usuario : ""}</td>
            <td>${record.mp_registro}</td>
            <td>$ ${record.valor_mp_registro}</td>
            <td>${record.peso_mp_registro} Tons</td>
            <td>$ ${record.valor_t_registro}</td>
            <td>${record.peso_neto_registro} Tons</td>
          </tr>
          `;
      });
    };
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const formattedDate = format(date, "EEEE d 'de' MMMM 'del' yyyy", {
        locale: es,
      });
      return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    };
    const sumValues = (records, key) => {
      return records.reduce((total, record) => {
        const keys = key.split(".");
        let value = record;
        keys.forEach((k) => {
          value = value[k];
        });
        return total + parseFloat(value || 0);
      }, 0);
    };
    const formatTime = (time) => {
      return time.slice(0, 5);
    };

    const contenido = `
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
        margin: 0px;
        text-align: left;
      }

      .aside div p {
        font-size: 1rem;
        margin: 0px;
        text-align: left;
      }

      .aside .asideSpecial {
        width: 70%;
      }

      .table {
        border-collapse: collapse;
        width: 100%;
      }

      .tableHead,
      .tableBody,
      .tableFooter {
        width: 100%;
      }

      .tableHead tr,
      .tableBody tr,
      .tableFooter tr {
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
        width: 16.66%;
      }

      .tableBody tr:nth-child(odd) {
        color: #000000;
        background-color: #a4adc5;
      }
        
      .tableBody tr:nth-child(even) {
        color: #000000;
        background-color: #9097b7;
      }

      .tableBody tr td {
        font-size: 1rem;
        text-align: center;
        vertical-align: baseline;
        width: 16.66%;
      }

      .tableFooter tr th {
        padding-top: 15px;
        vertical-align: baseline;
        text-align: center;
      }

      .tableFooter tr td {
        font-size: 1rem;
        text-align: left;
        vertical-align: baseline;
        width: 100%;
      }
    </style>
    <aside class="aside">
      <div>
        <h2>Fecha de registro</h2>
        <p>${formatDate(item[0].fecha_registro)}</p>
      </div>
      <div>
        <h2>Hora de registro</h2>
        <p>${formatTime(item[0].hora_registro)}</p>
      </div>
      <div>
        <h2>Tipo de registro</h2>
        <p>${item[0].tipo_registro}</p>
      </div>
      <div>
        <h2>Registro de materia prima</h2>
        <p>N° ${item[0].id_registro}</p>
      </div>
      <div>
        <h2>Valor de la materia prima</h2>
        <p>${sumValues(item, "valor_mp_registro").toFixed(0)}</p>
      </div>
      <div>
        <h2>Valor de transporte</h2>
        <p>${sumValues(item, "valor_t_registro").toFixed(0)}</p>
      </div>
      <div class="asideSpecial">
        <h2>Realizado por</h2>
        <p>${item[0].titular.nombre_usuario}</p>
      </div>
    </aside>
    <table class="table">
      <thead class="tableHead">
        <tr>
          <th>Proveedor</th>
          <th>Materia prima</th>
          <th>Valor materia prima</th>
          <th>Peso materia prima</th>
          <th>Valor transporte</th>
          <th>Peso neto</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        ${renderRows(item).join("")}
      </tbody>
      <tfoot class="tableFooter">
        <tr>
          <th colSpan="6">Observaciones</th>
        </tr>
        <tr>
          <td colSpan="6">
            ${
              item[0].observacion_registro !== ""
                ? item[0].observacion_registro
                : "No se registró"
            }
          </td>
        </tr>
      </tfoot>
    </table>
    `;
    try {
      setLoading(true);
      const response = await axios.post(
        `http://${localIP}:3000/pdf`,
        {
          titulo: `${item[0].tipo_registro} de materia prima`,
          contenido: contenido,
        },
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error al imprimir: ", error);
    }
  };

  const redirectRegister = () => {
    navigate("/inventory/registerrawmaterial");
  };

  return (
    <>
      <motion.main
        className={Style.inventoryRawMaterialRegisterActionDetailMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2>{item.length > 0 && formatDate(item[0].fecha_registro)}</h2>
        </div>
        <div>
          <h2>Registro de materia prima</h2>
          <p>N° {item.length > 0 && `${item[0].id_registro}`}</p>
        </div>
        <div>
          <h2>Realizado por</h2>
          <p>{item.length > 0 && `${item[0].titular.nombre_usuario}`}</p>
        </div>
        <div>
          <h2>Valor de la materia prima</h2>
          <p>{sumValues(item, "valor_mp_registro").toFixed(0)}</p>
        </div>
        <div>
          <h2>Valor de transporte</h2>
          <p>{sumValues(item, "valor_t_registro").toFixed(0)}</p>
        </div>
      </motion.main>
      <motion.footer
        className={Style.inventoryRawMaterialRegisterActionDetailFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button" onClick={printItem}>
          {loading ? <div className={Style.loader}></div> : "Imprimir registro"}
        </button>
        <button type="button" onClick={redirectRegister}>
          Volver
        </button>
      </motion.footer>
    </>
  );
}

export default InventoryRawMaterialRegisterActionDetail;
