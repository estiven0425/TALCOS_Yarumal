import { es } from "date-fns/locale";
import { format, isValid, parseISO } from "date-fns";
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

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatIfDate = (value) => {
    if (typeof value === "string") {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        const formatted = format(parsed, "EEEE d 'de' MMMM 'del' yyyy", {
          locale: es,
        });
        return capitalizeFirstLetter(formatted);
      }
    }
    return value;
  };

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
                {body.map((key) => (
                  <td key={key}>
                    {formatIfDate(item[key])} {optional[key] || ""}
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
