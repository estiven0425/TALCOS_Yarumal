import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-edit-windmill-table.module.css";

function InventoryListEditWindmillTable() {
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
  const redirectEditInventory = (molino) => {
    navigate("/editwindmill", { state: molino });
  };

  return (
    <>
      <header className={Style.inventorytListEditWindmillTableHeader}>
        <h1>Seleccione un molino para editar</h1>
      </header>
      <main className={Style.inventorytListEditWindmillTableMain}>
        {molino.length > 0 ? (
          <motion.table
            className={Style.inventorytListEditWindmillTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead
              className={Style.inventorytListEditWindmillTableMainTableHead}
            >
              <tr>
                <th>Nombre</th>
                <th>Horómetro</th>
              </tr>
            </thead>
            <tbody
              className={Style.inventorytListEditWindmillTableMainTableBody}
            >
              {molino.map((molino) => (
                <tr
                  key={molino.id_molino}
                  onClick={() => redirectEditInventory(molino)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectEditInventory(molino);
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
            className={Style.inventorytListEditWindmillTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen molinos</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventorytListEditWindmillTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListEditWindmillTable;
