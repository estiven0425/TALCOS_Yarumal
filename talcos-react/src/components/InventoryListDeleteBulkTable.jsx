import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-delete-bulk-table.module.css";

function InventoryListDeleteBulkTable() {
  const [bulto, setBulto] = useState([]);
  const navigate = useNavigate();
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
  const redirectInventory = () => {
    navigate("/inventorybulk");
  };
  const redirectDeleteInventory = (bulto) => {
    navigate("/deletebulk", { state: bulto });
  };

  return (
    <>
      <header className={Style.inventoryListDeleteBulkTableHeader}>
        <h1>Seleccione un bulto para eliminar</h1>
      </header>
      <main className={Style.inventoryListDeleteBulkTableMain}>
        {bulto.length > 0 ? (
          <motion.table
            className={Style.inventoryListDeleteBulkTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventoryListDeleteBulkTableMainTableHead}>
              <tr>
                <th>Nombre</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody className={Style.inventoryListDeleteBulkTableMainTableBody}>
              {bulto.map((bulto) => (
                <tr
                  key={bulto.id_bulto}
                  onClick={() => redirectDeleteInventory(bulto)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteInventory(bulto);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{bulto.nombre_bulto}</td>
                  <td>{bulto.capacidad_bulto} Kg</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListDeleteBulkTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen bultos</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListDeleteBulkTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteBulkTable;
