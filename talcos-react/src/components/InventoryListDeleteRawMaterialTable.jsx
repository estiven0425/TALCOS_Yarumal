import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-delete-raw-material-table.module.css";

function InventoryListDeleteRawMaterialTable() {
  const [materiaPrima, setMateriaPrima] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getRawMaterial = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/materias_primas`
        );

        setMateriaPrima(response.data);
      } catch (error) {
        console.error("Error al obtener las materias primas: ", error);
      }
    };

    getRawMaterial();
  }, [localIP]);
  const redirectInventory = () => {
    navigate("/inventoryrawmaterial");
  };
  const redirectDeleteInventory = (rawMaterial) => {
    navigate("/deleterawmaterial", { state: rawMaterial });
  };

  return (
    <>
      <header className={Style.inventoryListDeleteRawMaterialTableHeader}>
        <h1>Seleccione una materia prima para eliminar</h1>
      </header>
      <main className={Style.inventoryListDeleteRawMaterialTableMain}>
        {materiaPrima.length > 0 ? (
          <motion.table
            className={Style.inventoryListDeleteRawMaterialTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead
              className={Style.inventoryListDeleteRawMaterialTableMainTableHead}
            >
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
              </tr>
            </thead>
            <tbody
              className={Style.inventoryListDeleteRawMaterialTableMainTableBody}
            >
              {materiaPrima.map((materiaPrima) => (
                <tr
                  key={materiaPrima.id_materia_prima}
                  onClick={() => redirectDeleteInventory(materiaPrima)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteInventory(materiaPrima);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{materiaPrima.nombre_materia_prima}</td>
                  <td>{materiaPrima.cantidad_materia_prima} Kg</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListDeleteRawMaterialTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen materias primas</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListDeleteRawMaterialTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteRawMaterialTable;
