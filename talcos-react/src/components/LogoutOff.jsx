import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Style from "./styles/logout-off.module.css";

function LogoutOff() {
  const navigate = useNavigate();
  const [sendStatus, setSendStatus] = useState(false);

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/", {
          replace: true,
        });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [navigate, sendStatus]);

  const closeSession = () => {
    sessionStorage.removeItem("token");

    setSendStatus(true);
  };

  return (
    <>
      {!sendStatus ? (
        <>
          <motion.main
            className={Style.logOutMain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1>¿Seguro que desea cerrar la sesión?</h1>
          </motion.main>
          <motion.footer
            className={Style.logOutFooter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button" onClick={() => closeSession()}>
              Cerrar sesión
            </button>
          </motion.footer>
        </>
      ) : (
        <motion.main
          className={Style.logOutAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Sesión cerrada con éxito</h1>
        </motion.main>
      )}
    </>
  );
}

export default LogoutOff;
