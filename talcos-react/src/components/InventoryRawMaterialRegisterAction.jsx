import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-raw-material-register-action.module.css";

function InventoryRawMaterialRegisterAction({ item }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  const printItem = async (e) => {
    e.preventDefault();

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
    const formatTime = (time) => {
      return time.slice(0, 5);
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
        width: 14.28%;
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
        width: 14.28%;
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
        <p>${formatDate(item.fecha_registro)}</p>
      </div>
      <div>
        <h2>Hora de registro</h2>
        <p>${formatTime(item.hora_registro)}</p>
      </div>
      <div>
        <h2>Tipo de registro</h2>
        <p>${item.tipo_registro}</p>
      </div>
      <div>
        <h2>Remision</h2>
        <p>${item.remision_registro}</p>
      </div>
      <div>
        <h2>Concepto</h2>
        <p>${item.concepto_registro}</p>
      </div>
      <div>
        <h2>Zona</h2>
        <p>${item.zona_registro}</p>
      </div>
      <div>
        <h2>Bonificación por tonelada</h2>
        <p>${item.bonificacion_registro}</p>
      </div>
      <div>
        <h2>Valor de transporte</h2>
        <p>${item.valor_t_registro}</p>
      </div>
      <div class="asideSpecial">
        <h2>Realizado por</h2>
        <p>${item.titular.nombre_usuario}</p>
      </div>
    </aside>
    <table class="table">
      <thead class="tableHead">
        <tr>
          <th>Proveedor</th>
          <th>Documento proveedor</th>
          <th>Transportador</th>
          <th>Documento transportador</th>
          <th>Materia prima</th>
          <th>Valor materia prima</th>
          <th>Peso materia prima</th>
        </tr>
      </thead>
      <tbody class="tableBody">
        <tr>
          <td>${item.nombre_proveedor_registro}</td>
          <td>${item.documento_proveedor_registro}</td>
          <td>${item.nombre_transportador_registro}</td>
          <td>${item.documento_transportador_registro}</td>
          <td>${item.mp_registro}</td>
          <td>$ ${item.valor_mp_registro}</td>
          <td>${item.peso_mp_registro} Tons</td>
        </tr>
      </tbody>
      <tfoot class="tableFooter">
        <tr>
          <th colSpan="7">Observaciones</th>
        </tr>
        <tr>
          <td colSpan="7">
            ${
              item.observacion_registro !== ""
                ? item.observacion_registro
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
          titulo: `${item.tipo_registro} de materia prima`,
          contenido: content,
          nombre: "Registro de materia prima",
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
      a.download = "registro_de_materia_prima.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error al imprimir: ", error);
    }
  };

  const redirectCreate = (data) => {
    navigate("/inventory/createregisterrawmaterial", { state: data });
  };
  const redirectDetail = () => {
    navigate("/inventory/detailregisterrawmaterial", { state: item });
  };
  const redirectDelete = () => {
    navigate("/inventory/deleteregisterrawmaterial", {
      state: item.id_registro,
    });
  };

  return (
    <>
      {item ? (
        <>
          <motion.main
            className={Style.inventoryRawMaterialRegisterActionMain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2>Remision</h2>
              <p>{item.remision_registro}</p>
            </div>
            <div>
              <h2>Proveedor</h2>
              <p>{item.nombre_proveedor_registro}</p>
            </div>
            <div>
              <h2>Transportador</h2>
              <p>{item.nombre_transportador_registro}</p>
            </div>
            <div>
              <h2>Tipo de registro</h2>
              <p>{item.tipo_registro}</p>
            </div>
            <div>
              <h2>Valor de la materia prima</h2>
              <p>{item.valor_mp_registro}</p>
            </div>
            <div>
              <h2>Valor de transporte</h2>
              <p>{item.valor_t_registro}</p>
            </div>
          </motion.main>
          <motion.footer
            className={
              Style.inventoryRawMaterialRegisterActionFooterAlternative
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button" onClick={printItem}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Imprimir registro"
              )}
            </button>
            <button type="button" onClick={redirectDetail}>
              Detalles registro
            </button>
            <button type="button" onClick={redirectDelete}>
              Eliminar registro
            </button>
          </motion.footer>
        </>
      ) : (
        <>
          <motion.header
            className={Style.inventoryRawMaterialRegisterActionHeader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Selecciona un registro para ver sus detalles y funciones</h2>
          </motion.header>
          <motion.main
            className={Style.inventoryRawMaterialRegisterActionMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>O selecciona una de las siguiente opciones</h2>
          </motion.main>
          <motion.footer
            className={Style.inventoryRawMaterialRegisterActionFooter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              onClick={() => redirectCreate("Registro manual")}
            >
              Registrar manualmente
            </button>
            <button
              type="button"
              onClick={() => redirectCreate("Registro importado")}
            >
              Importar registro
            </button>
          </motion.footer>
        </>
      )}
    </>
  );
}

export default InventoryRawMaterialRegisterAction;
