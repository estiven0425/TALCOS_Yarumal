import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Style from "./styles/generate-novelty-strike-option-button.module.css";

function GenerateNoveltyStrikeOption() {
  const navigate = useNavigate();

  const redirectStar = () => {
    navigate("/generatereport/noveltystrikestart");
  };
  const redirectFinish = () => {
    navigate("/generatereport/noveltystrikestop");
  };

  return (
    <motion.header
      className={Style.generateNoveltyStrikeOptionButtonHeader}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => redirectStar()} type="button">
        <h2>Iniciar paro </h2>
        <img alt="Icono" src="/play_strike.svg"></img>
      </button>
      <button onClick={() => redirectFinish()} type="button">
        <h2>Finalizar paro</h2>
        <img alt="Icono" src="/stop_strike.svg"></img>
      </button>
    </motion.header>
  );
}

export default GenerateNoveltyStrikeOption;
