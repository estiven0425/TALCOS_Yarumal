import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/generate-novelty-windmill-option-button.module.css";

function GenerateNoveltyWindmillOption() {
  const navigate = useNavigate();

  const redirectPowerOn = () => {
    navigate("/generatereport/noveltywindmillpoweron");
  };
  const redirectPowerOff = () => {
    navigate("/generatereport/noveltywindmillpoweroff");
  };

  return (
    <motion.header
      className={Style.generateNoveltyWindmillOptionButtonHeader}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <button onClick={() => redirectPowerOn()} type="button">
        <h2>Encender molino </h2>
        <img alt="Icono" src="/play_strike.svg"></img>
      </button>
      <button onClick={() => redirectPowerOff()} type="button">
        <h2>Apagar molino</h2>
        <img alt="Icono" src="/stop_strike.svg"></img>
      </button>
    </motion.header>
  );
}

export default GenerateNoveltyWindmillOption;
