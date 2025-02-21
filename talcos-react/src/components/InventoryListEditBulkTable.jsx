import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-edit-bulk-table.module.css";

function InventoryListEditBulkTable() {
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
  const redirectEditInventory = (bulto) => {
    navigate("/editbulk", { state: bulto });
  };

  return (
    <>
      <header className={Style.inventorytListEditBulkTableHeader}>
        <h1>Seleccione un bulto para editar</h1>
      </header>
      <main className={Style.inventorytListEditBulkTableMain}>
        {bulto.length > 0 ? (
          <motion.table
            className={Style.inventorytListEditBulkTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventorytListEditBulkTableMainTableHead}>
              <tr>
                <th>Nombre</th>
                <th>Capacidad</th>
              </tr>
            </thead>
            <tbody className={Style.inventorytListEditBulkTableMainTableBody}>
              {bulto.map((bulto) => (
                <tr
                  key={bulto.id_bulto}
                  onClick={() => redirectEditInventory(bulto)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectEditInventory(bulto);
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
            className={Style.inventorytListEditBulkTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen bultos</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventorytListEditBulkTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListEditBulkTable;
