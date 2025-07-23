import { es } from "date-fns/locale";
import { format, isValid, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Style from "./styles/inventory-list-table.module.css";

InventoryListDeleteTable.propTypes = {
  endpoint: PropTypes.any,
  redirectPath: PropTypes.any,
  title: PropTypes.any,
  head: PropTypes.any,
  index: PropTypes.any,
  body: PropTypes.any,
  name: PropTypes.any,
  optional: PropTypes.any,
};

function InventoryListDeleteTable({
  endpoint,
  redirectPath,
  title,
  head,
  index,
  body,
  name,
  optional,
}) {
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItem = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(`http://${localIP}:3000/${endpoint}`);

        const data = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);

        setItem(data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getItem();
  }, [endpoint, localIP]);

  const redirectInventory = () => {
    navigate(`/inventory/inventory${redirectPath}`);
  };

  const redirectDeleteInventory = (data) => {
    navigate(`/inventory/delete${redirectPath}`, { state: data });
  };

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
      <header className={Style.inventoryListTableHeader}>
        <h1>Seleccione {title} para eliminar</h1>
      </header>
      <main className={Style.inventoryListTableMain}>
        {item.length > 0 ? (
          <motion.table
            className={Style.inventoryListTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventoryListTableMainTableHead}>
              <tr>
                {head.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className={Style.inventoryListTableMainTableBody}>
              {item.map((item) => (
                <tr
                  key={item[index]}
                  onClick={() => redirectDeleteInventory(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteInventory(item);
                    }
                  }}
                  tabIndex="0"
                >
                  {body.map((body) => (
                    <td key={body}>
                      {formatIfDate(item[body])} {optional[body] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen {name}</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteTable;
