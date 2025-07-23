import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/error-main.module.css";

function ErrorMain() {
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/home");
  };

  return (
    <>
      <motion.main
        className={Style.errorMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>
          ¡Ops! <br /> Parece que entraste a un lugar desconocido
        </h1>
      </motion.main>
      <motion.footer
        className={Style.errorFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button" onClick={() => redirect()}>
          Volver al inicio
        </button>
      </motion.footer>
    </>
  );
}

export default ErrorMain;
