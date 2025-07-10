import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InventoryAggregateActionDetail from "./InventoryAggregateActionDetail";
import Style from "./styles/inventory-aggregate-list-detail.module.css";

function InventoryAggregateListDetail() {
  const [item, setItem] = useState(null);
  const location = useLocation();
  const data = location.state || null;

  useEffect(() => {
    if (data) {
      setItem(data);
    }
  }, [data]);

  return (
    <>
      {item ? (
        <>
          <motion.section
            className={Style.inventoryAggregateListDetailPrimary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.table
              className={Style.inventoryAggregateListDetailPrimaryTable}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <caption>
                <h2>Registro AP</h2>
              </caption>
              <thead
                className={Style.inventoryAggregateListDetailPrimaryTableHead}
              >
                <tr>
                  <th>Ingreso a tolva de roca</th>
                  <th>Registros por Bob - Cat de roca</th>
                  <th>Ingreso a tolva de grueso</th>
                  <th>Registros por Bob - Cat de grueso</th>
                  <th>Peso promedio del Bob - Cat</th>
                  <th>Horómetro inicial AP</th>
                  <th>Horómetro final AP</th>
                  <th>Tiempo de operación</th>
                </tr>
              </thead>
              <tbody
                className={Style.inventoryAggregateListDetailPrimaryTableBody}
              >
                <tr>
                  <td>{item.ingreso_roca_registro_ap} Kg</td>
                  <td>{item.bobcat_roca_registro_ap}</td>
                  <td>{item.ingreso_grueso_registro_ap} Kg</td>
                  <td>{item.bobcat_grueso_registro_ap}</td>
                  <td>{item.peso_bobcat_registro_ap}</td>
                  <td>{item.horometro_inicio_registro_ap}</td>
                  <td>{item.horometro_fin_registro_ap}</td>
                  <td>
                    {item.horometro_fin_registro_ap -
                      item.horometro_inicio_registro_ap}
                    :00 Hrs
                  </td>
                </tr>
              </tbody>
              <tfoot
                className={Style.inventoryAggregateListDetailPrimaryTableFooter}
              >
                <tr>
                  <th colSpan="8">Observaciones</th>
                </tr>
                <tr>
                  <td colSpan="8">
                    {item.observacion_registro_ap !== ""
                      ? item.observacion_registro_ap
                      : "No se registró"}
                  </td>
                </tr>
              </tfoot>
            </motion.table>
          </motion.section>
          <motion.section
            className={Style.inventoryAggregateListSecondary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InventoryAggregateActionDetail item={item} />
          </motion.section>
        </>
      ) : (
        <motion.section
          className={Style.inventoryAggregateListDetailPrimaryAlternative}
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

export default InventoryAggregateListDetail;
