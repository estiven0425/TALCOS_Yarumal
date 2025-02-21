import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-delete-reference-table.module.css";

function InventoryListDeleteReferenceTable() {
  const [referencia, setReferencia] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getReference = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/referencias`);

        setReferencia(response.data);
      } catch (error) {
        console.error("Error al obtener las referencias: ", error);
      }
    };

    getReference();
  }, [localIP]);
  const redirectInventory = () => {
    navigate("/inventoryreference");
  };
  const redirectDeleteInventory = (referencia) => {
    navigate("/deletereference", { state: referencia });
  };

  return (
    <>
      <header className={Style.inventoryListDeleteReferenceTableHeader}>
        <h1>Seleccione una referencia para eliminar</h1>
      </header>
      <main className={Style.inventoryListDeleteReferenceTableMain}>
        {referencia.length > 0 ? (
          <motion.table
            className={Style.inventoryListDeleteReferenceTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead
              className={Style.inventoryListDeleteReferenceTableMainTableHead}
            >
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Cliente</th>
              </tr>
            </thead>
            <tbody
              className={Style.inventoryListDeleteReferenceTableMainTableBody}
            >
              {referencia.map((referencia) => (
                <tr
                  key={referencia.id_referencia}
                  onClick={() => redirectDeleteInventory(referencia)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteInventory(referencia);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{referencia.nombre_referencia}</td>
                  <td>{referencia.cantidad_referencia} Tons</td>
                  <td>{referencia.cliente_referencia}</td>
                </tr>
              ))}
            </tbody>
          </motion.table>
        ) : (
          <motion.div
            className={Style.inventoryListDeleteReferenceTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen referencias</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.inventoryListDeleteReferenceTableFooter}>
        <button type="button" onClick={() => redirectInventory()}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default InventoryListDeleteReferenceTable;
