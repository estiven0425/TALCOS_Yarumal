import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list.module.css";

function InventoryList({ location, head, index, body, name, optional }) {
  const [item, setItem] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/${location}`);
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
              {head.map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody className={Style.inventoryListMainTableBody}>
            {item.map((item) => (
              <tr key={item[index]}>
                {body.map((body) => (
                  <td key={body}>
                    {item[body]} {optional[body] || ""}
                  </td>
                ))}
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
          <h2>No existen {name}</h2>
        </motion.div>
      )}
    </>
  );
}

export default InventoryList;
