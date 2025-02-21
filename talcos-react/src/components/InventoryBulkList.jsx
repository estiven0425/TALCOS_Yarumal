import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-bulk-list.module.css";

function InventoryBulkList() {
  const [bulto, setBulto] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getBulk = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/bultos`);

        setBulto(response.data);
      } catch (error) {
        console.error("Error al obtener los bultos: ", error);
      }
    };

    getBulk();
  }, [localIP]);

  return (
    <>
      {bulto.length > 0 ? (
        <motion.table
          className={Style.inventoryBulkListMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.inventoryBulkListMainTableHead}>
            <tr>
              <th>Nombre</th>
              <th>Capacidad</th>
            </tr>
          </thead>
          <tbody className={Style.inventoryBulkListMainTableBody}>
            {bulto.map((bulto) => (
              <tr key={bulto.id_bulto}>
                <td>{bulto.nombre_bulto}</td>
                <td>{bulto.capacidad_bulto} Kg</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.inventoryBulkListMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen bultos</h2>
        </motion.div>
      )}
    </>
  );
}

export default InventoryBulkList;
