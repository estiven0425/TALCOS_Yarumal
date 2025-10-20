import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import axios from "axios";

import Style from "./styles/fast-inventory-list.module.css";

function FastInventoryReference() {
  const [referencia, setReferencia] = useState([]);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getReference = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(`http://${localIP}:3000/referencias`);

        setReferencia(response.data);
      } catch (error) {
        console.error("Error al obtener las referencias: ", error);
      }
    };

    void getReference();
  }, [localIP]);

  const talcProduced = (
    referencia.reduce(
      (total, referencia) => total + referencia.cantidad_referencia * 1000,
      0,
    ) / 1000
  ).toFixed(2);

  // noinspection JSValidateTypes
  return referencia.length > 0 ? (
    <>
      <motion.header
        className={Style.fastInventoryListHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Inventario de talco en bodega</h1>
      </motion.header>
      <motion.main
        className={Style.fastInventoryListMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {referencia.map((referencia) => (
          <div key={referencia.id_referencia}>
            <h2>{referencia.nombre_referencia}</h2>
            <p>{referencia.cantidad_referencia} Tons</p>
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
          <h2>Talco total en bodega</h2>
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

// noinspection JSUnusedGlobalSymbols
export default FastInventoryReference;
