import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-delete-windmill-table.module.css";

function InventoryListDeleteWindmillTable() {
  const [molino, setMolino] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getWindmill = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/molinos`);

        setMolino(response.data);
      } catch (error) {
        console.error("Error al obtener los molinos: ", error);
      }
    };

    getWindmill();
  }, [localIP]);
  const redirectInventory = () => {
    navigate("/inventorywindmill");
  };
  const redirectDeleteInventory = (molino) => {
    navigate("/deletewindmill", { state: molino });
  };

  return (
    <>
      <header className={Style.inventoryListDeleteWindmillTableHeader}>
        <h1>Seleccione un molino para eliminar</h1>
      </header>
      <main className={Style.inventoryListDeleteWindmillTableMain}>
        {molino.length > 0 ? (
          <motion.table
            className={Style.inventoryListDeleteWindmillTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead
              className={Style.inventoryListDeleteWindmillTableMainTableHead}
            >
              <tr>
                <th>Nombre</th>
                <th>Horómetro</th>
              </tr>
            </thead>
            <tbody
              className={Style.inventoryListDeleteWindmillTableMainTableBody}
            >
              {molino.map((molino) => (
                <tr
                  key={molino.id_molino}
                  onClick={() => redirectDeleteInventory(molino)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteInventory(molino);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{molino.nombre_molino}</td>
                  <td>{molino.horometro_molino}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListDeleteWindmillTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen molinos</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListDeleteWindmillTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteWindmillTable;
