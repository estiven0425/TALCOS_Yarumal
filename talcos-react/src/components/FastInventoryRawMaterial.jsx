import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/fast-inventory-list.module.css";

function FastInventoryRawMaterial() {
  const [materiaPrima, setMateriaPrima] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getRawMaterial = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(
          `http://${localIP}:3000/materias_primas`,
        );

        setMateriaPrima(response.data);
      } catch (error) {
        console.error("Error al obtener las materias primas: ", error);
      }
    };

    void getRawMaterial();
  }, [localIP]);

  const talcProduced = (
    materiaPrima.reduce(
      (total, materiaPrima) =>
        total + materiaPrima.cantidad_materia_prima * 1000,
      0,
    ) / 1000
  ).toFixed(2);

  // noinspection JSValidateTypes
  return materiaPrima.length > 0 ? (
    <>
      <motion.header
        className={Style.fastInventoryListHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Inventario de materia prima en bodega</h1>
      </motion.header>
      <motion.main
        className={Style.fastInventoryListMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {materiaPrima.map((materiaPrima) => (
          <div key={materiaPrima.id_materia_prima}>
            <h2>{materiaPrima.nombre_materia_prima}</h2>
            <p>{materiaPrima.cantidad_materia_prima} Tons</p>
          </div>
        ))}
      </motion.main>
      <motion.footer
        className={Style.fastInventoryListFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2>Materia prima total en bodega</h2>
          <p>{talcProduced} Tons</p>
        </div>
      </motion.footer>
    </>
  ) : (
    <motion.div
      className={Style.fastInventoryListAlternative}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className={Style.loader}></div>
    </motion.div>
  );
}

export default FastInventoryRawMaterial;
