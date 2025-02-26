import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-delete-table.module.css";

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
        const response = await axios.get(`http://${localIP}:3000/${endpoint}`);

        setItem(response.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getItem();
  }, [localIP]);
  const redirectInventory = () => {
    navigate(`/inventory/inventory${redirectPath}`);
  };
  const redirectDeleteInventory = (data) => {
    navigate(`/inventory/delete${redirectPath}`, { state: data });
  };

  return (
    <>
      <header className={Style.inventoryListDeleteTableHeader}>
        <h1>Seleccione {title} para editar</h1>
      </header>
      <main className={Style.inventoryListDeleteTableMain}>
        {item.length > 0 ? (
          <motion.table
            className={Style.inventoryListDeleteTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventoryListDeleteTableMainTableHead}>
              <tr>
                {head.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className={Style.inventoryListDeleteTableMainTableBody}>
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
                      {item[body]} {optional[body] || ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListDeleteTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen {name}</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListDeleteTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteTable;
