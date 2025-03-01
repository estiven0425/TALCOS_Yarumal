import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-edit-table.module.css";

function InventoryListEditTable({
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
  const redirectInventory = () => {
    navigate(`/inventory/inventory${redirectPath}`);
  };
  const redirectEditInventory = (data) => {
    navigate(`/inventory/edit${redirectPath}`, { state: data });
  };

  return (
    <>
      <header className={Style.inventorytListEditTableHeader}>
        <h1>Seleccione {title} para editar</h1>
      </header>
      <main className={Style.inventorytListEditTableMain}>
        {item.length > 0 ? (
          <motion.table
            className={Style.inventorytListEditTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventorytListEditTableMainTableHead}>
              <tr>
                {head.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className={Style.inventorytListEditTableMainTableBody}>
              {item.map((item) => (
                <tr
                  key={item[index]}
                  onClick={() => redirectEditInventory(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectEditInventory(item);
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
            className={Style.inventorytListEditTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen {name}</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventorytListEditTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListEditTable;
