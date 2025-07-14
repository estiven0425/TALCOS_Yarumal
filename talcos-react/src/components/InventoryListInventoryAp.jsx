import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-inventory-ap.module.css";

function InventoryListInventoryAp() {
  const [item, setItem] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/inventario_ap`,
        );
        const data = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);

        setItem(data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getItem();
  }, [localIP]);

  return (
    <>
      {item.length > 0 ? (
        <motion.table
          className={Style.inventoryListMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.inventoryListMainTableHead}>
            <tr>
              <th>Tipo</th>
              <th>Nombre</th>
              <th>Porcentaje</th>
              <th>Total</th>
              <th>Cantidad correspondiente</th>
            </tr>
          </thead>
          <tbody className={Style.inventoryListMainTableBody}>
            {item.map((item) => (
              <tr key={item.id_inventario_ap}>
                <td>{item.tipo_inventario_ap}</td>
                <td>{item.nombre_inventario_ap}</td>
                <td>{item.porcentaje_inventario_ap} %</td>
                <td>{item.total_inventario_ap} Kg</td>
                <td>
                  {(
                    (item.total_inventario_ap * item.porcentaje_inventario_ap) /
                    100
                  ).toFixed(2)}{" "}
                  Kg
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.inventoryListMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen inventarios AP</h2>
        </motion.div>
      )}
    </>
  );
}

export default InventoryListInventoryAp;
