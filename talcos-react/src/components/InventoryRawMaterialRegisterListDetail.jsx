import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import InventoryRawMaterialRegisterActionDetail from "./InventoryRawMaterialRegisterActionDetail";

import Style from "./styles/inventory-raw-material-register-list-detail.module.css";

function InventoryRawMaterialRegisterListDetail() {
  const [item, setItem] = useState(null);
  const location = useLocation();
  const data = location.state || null;

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  const formatTime = (time) => {
    return time.slice(0, 5);
  };

  return (
    <>
      {item ? (
        <>
          <motion.section
            className={Style.inventoryRawMaterialRegisterListDetailPrimary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.table
              className={
                Style.inventoryRawMaterialRegisterListDetailPrimaryTable
              }
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <caption>
                <h2>{item.tipo_registro} </h2>
                <span>Hora de registro: {formatTime(item.hora_registro)}</span>
              </caption>
              <thead
                className={
                  Style.inventoryRawMaterialRegisterListDetailPrimaryTableHead
                }
              >
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
              <tbody
                className={
                  Style.inventoryRawMaterialRegisterListDetailPrimaryTableBody
                }
              >
                <tr>
                  <td>{item.nombre_proveedor_registro}</td>
                  <td>{item.documento_proveedor_registro}</td>
                  <td>{item.nombre_transportador_registro}</td>
                  <td>{item.documento_transportador_registro}</td>
                  <td>{item.mp_registro}</td>
                  <td>$ {item.valor_mp_registro}</td>
                  <td>{item.peso_mp_registro} Tons</td>
                </tr>
              </tbody>
              <tfoot
                className={
                  Style.inventoryRawMaterialRegisterListDetailPrimaryTableFooter
                }
              >
                <tr>
                  <th colSpan="7">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="7">
                    {item.observacion_registro !== ""
                      ? item.observacion_registro
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
      ) : (
        <motion.section
          className={
            Style.inventoryRawMaterialRegisterListDetailPrimaryAlternative
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.section>
      )}
    </>
  );
}

export default InventoryRawMaterialRegisterListDetail;
