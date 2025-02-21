import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-reference-list.module.css";

function InventoryReferenceList() {
  const [referencia, setReferencia] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getReference = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/referencias`);

        setReferencia(response.data);
      } catch (error) {
        console.error("Error al obtener las referencias: ", error);
      }
    };

    getReference();
  }, [localIP]);

  return (
    <>
      {referencia.length > 0 ? (
        <motion.table
          className={Style.inventoryReferenceListMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.inventoryReferenceListMainTableHead}>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
              <th>Cliente</th>
            </tr>
          </thead>
          <tbody className={Style.inventoryReferenceListMainTableBody}>
            {referencia.map((referencia) => (
              <tr key={referencia.id_referencia}>
                <td>{referencia.nombre_referencia}</td>
                <td>{referencia.cantidad_referencia} Tons</td>
                <td>{referencia.cliente_referencia}</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.inventoryReferenceListMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen referencias</h2>
        </motion.div>
      )}
    </>
  );
}

export default InventoryReferenceList;
