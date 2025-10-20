import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";

import Style from "./styles/inventory-list-table-inventory-ap.module.css";

function InventoryListEditTableInventoryAp() {
  const [item, setItem] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItem = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(
          `http://${localIP}:3000/inventario_ap`,
        );

        const data = Array.isArray(response.data)
          ? response.data
          : Object.values(response.data);

        setItem(data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    void getItem();
  }, [localIP]);

  const redirectInventory = () => {
    navigate(`/inventory/inventoryap`);
  };

  const redirectEditInventory = (data) => {
    navigate(`/inventory/editinventoryap`, { state: data });
  };

  return (
    <>
      <header className={Style.inventoryListTableHeader}>
        <h1>Seleccione inventario AP para editar</h1>
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
                <th>Tipo</th>
                <th>Nombre</th>
                <th>Porcentaje</th>
                <th>Total</th>
                <th>Cantidad correspondiente</th>
              </tr>
            </thead>
            <tbody className={Style.inventoryListTableMainTableBody}>
              {item.map((item) => (
                <tr
                  key={item.id_inventario_ap}
                  onClick={() => redirectEditInventory(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectEditInventory(item);
                    }
                  }}
                  tabIndex="0"
                >
                  <td>{item.tipo_inventario_ap}</td>
                  <td>{item.nombre_inventario_ap}</td>
                  <td>{item.porcentaje_inventario_ap} %</td>
                  <td>{item.total_inventario_ap}</td>
                  <td>
                    {(
                      (item.total_inventario_ap *
                        item.porcentaje_inventario_ap) /
                      100
                    ).toFixed(2)}{" "}
                    Kg
                  </td>
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
            <h2>No existen inventarios AP</h2>
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

export default InventoryListEditTableInventoryAp;
