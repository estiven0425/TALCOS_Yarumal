import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InventoryRawMaterialRegisterActionDetail from "./InventoryRawMaterialRegisterActionDetail";
import Style from "./styles/inventory-raw-material-register-list-detail.module.css";

function InventoryRawMaterialRegisterListDetail() {
  const [item, setItem] = useState([]);
  const location = useLocation();
  const data = location.state || [];

  useEffect(() => {
    if (data.length > 0) {
      setItem(data);
    }
  }, [data]);

  const renderRows = (records) => {
    const renderedProviders = new Set();
    return records.map((record, index) => {
      const showProvider = !renderedProviders.has(
        record.proveedor.nombre_usuario
      );
      if (showProvider) {
        renderedProviders.add(record.proveedor.nombre_usuario);
      }
      return (
        <tr key={index}>
          <td>{showProvider ? record.proveedor.nombre_usuario : ""}</td>
          <td>{record.mp_registro}</td>
          <td>${record.valor_mp_registro}</td>
          <td>{record.peso_mp_registro} Tons</td>
          <td>${record.valor_t_registro}</td>
          <td>{record.peso_neto_registro} Tons</td>
        </tr>
      );
    });
  };

  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  return (
    <>
      <motion.section
        className={Style.inventoryRawMaterialRegisterListDetailPrimary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.table
          className={Style.inventoryRawMaterialRegisterListDetailPrimaryTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <caption>
            <h2>{item.length > 0 && `${item[0].tipo_registro}`}</h2>
            <span>
              {" "}
              Hora de registro:{" "}
              {item.length > 0 && `${formatTime(item[0].hora_registro)}`}
            </span>
          </caption>
          <thead
            className={
              Style.inventoryRawMaterialRegisterListDetailPrimaryTableHead
            }
          >
            <tr>
              <th>Proveedor</th>
              <th>Materia prima</th>
              <th>Valor materia prima</th>
              <th>Peso materia prima</th>
              <th>Valor transporte</th>
              <th>Peso neto</th>
            </tr>
          </thead>
          <tbody
            className={
              Style.inventoryRawMaterialRegisterListDetailPrimaryTableBody
            }
          >
            {renderRows(item)}
          </tbody>
          <tfoot
            className={
              Style.inventoryRawMaterialRegisterListDetailPrimaryTableFooter
            }
          >
            <tr>
              <th colSpan="6">Observaciones</th>
            </tr>
            <tr>
              <td colSpan="6">
                {item.length > 0 && `${item[0].observacion_registro}` !== ""
                  ? `${item[0].observacion_registro}`
                  : "No se registró"}
              </td>
            </tr>
          </tfoot>
        </motion.table>
      </motion.section>
      <motion.section
        className={Style.inventoryRawMaterialRegisterListSecondary}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <InventoryRawMaterialRegisterActionDetail item={item} />
      </motion.section>
    </>
  );
}

export default InventoryRawMaterialRegisterListDetail;
