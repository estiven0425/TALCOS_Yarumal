import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-raw-material-list.module.css";

function InventoryRawMaterialList() {
  const [materiaPrima, setMateriaPrima] = useState([]);
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

  return (
    <>
      {materiaPrima.length > 0 ? (
        <motion.table
          className={Style.inventoryRawMaterialListMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.inventoryRawMaterialListMainTableHead}>
            <tr>
              <th>Nombre</th>
              <th>Cantidad</th>
            </tr>
          </thead>
          <tbody className={Style.inventoryRawMaterialListMainTableBody}>
            {materiaPrima.map((materiaPrima) => (
              <tr key={materiaPrima.id_materia_prima}>
                <td>{materiaPrima.nombre_materia_prima}</td>
                <td>{materiaPrima.cantidad_materia_prima} Tons</td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.inventoryRawMaterialListMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen materias primas</h2>
        </motion.div>
      )}
    </>
  );
}

export default InventoryRawMaterialList;
