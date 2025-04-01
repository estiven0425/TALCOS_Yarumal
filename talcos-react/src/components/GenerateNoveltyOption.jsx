import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/generate-novelty-option.module.css";

function GenerateNoveltyOption() {
  const navigate = useNavigate();

  const redirect = (category) => {
    navigate(`/${category}`);
  };

  return (
    <>
      <motion.header
        className={Style.generateNoveltyOptionHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Seleccione el tipo de novedad que desea ingresar</h1>
      </motion.header>
      <motion.main
        className={Style.generateNoveltyOptionMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={Style.generateNoveltyOptionMainButton}
          onClick={() => redirect("generatereport/noveltystrike")}
          type="button"
        >
          <h2>Paro</h2>
          <img alt="Icono" src="/strike.svg"></img>
        </button>
        <button
          className={Style.generateNoveltyOptionMainButton}
          onClick={() => redirect("generatereport/noveltyreference")}
          type="button"
        >
          <h2>Cambio de referencia</h2>
          <img alt="Icono" src="/change_reference.svg"></img>
        </button>
        <button
          className={Style.generateNoveltyOptionMainButton}
          onClick={() => redirect("generatereport/noveltyoperator")}
          type="button"
        >
          <h2>Cambio de operador de molino</h2>
          <img alt="Icono" src="/change_operator.svg"></img>
        </button>
        <button
          className={Style.generateNoveltyOptionMainButton}
          onClick={() => redirect("generatereport/noveltyfreighter")}
          type="button"
        >
          <h2>Cambio de operador de minicargador</h2>
          <img alt="Icono" src="/change_freighter.svg"></img>
        </button>
        <button
          className={Style.generateNoveltyOptionMainButton}
          onClick={() => redirect("generatereport/noveltymechanic")}
          type="button"
        >
          <h2>Cambio de mecánico</h2>
          <img alt="Icono" src="/change_mechanic.svg"></img>
        </button>
      </motion.main>
    </>
  );
}

export default GenerateNoveltyOption;
