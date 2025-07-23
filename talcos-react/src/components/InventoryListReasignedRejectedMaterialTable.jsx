import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-list-table.module.css";

function InventoryListReasignedRejectedMaterialTable() {
  const [productoRechazado, setProductoRechazado] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getRejectetMaterial = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(
          `http://${localIP}:3000/productos_rechazados`,
        );

        const data = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);

        setProductoRechazado(data);
      } catch (error) {
        console.error("Error al obtener los productos rechazados: ", error);
      }
    };

    void getRejectetMaterial();
  }, [localIP]);

  const redirectInventory = () => {
    navigate(`/inventory/inventoryrejectedmaterial`);
  };

  const redirectReasignedInventory = (data) => {
    navigate(`/inventory/reasignedrejectedmaterial`, { state: data });
  };

  return (
    <>
      <header className={Style.inventoryListTableHeader}>
        <h1>Seleccione un producto rechazado para reasignar</h1>
      </header>
      <main className={Style.inventoryListTableMain}>
        {productoRechazado.length > 0 ? (
          <motion.table
            className={Style.inventoryListTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.inventoryListTableMainTableHead}>
              <tr>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Retención</th>
              </tr>
            </thead>
            <tbody className={Style.inventoryListTableMainTableBody}>
              {productoRechazado.map((productoRechazado) => (
                <tr
                  key={productoRechazado.id_producto_rechazado}
                  onClick={() => redirectReasignedInventory(productoRechazado)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectReasignedInventory(productoRechazado);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{productoRechazado.nombre_producto_rechazado}</td>
                  <td>{productoRechazado.cantidad_producto_rechazado}</td>
                  <td>{productoRechazado.retencion_producto_rechazado}</td>
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
            <h2>No existen productos rechazados</h2>
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

export default InventoryListReasignedRejectedMaterialTable;
