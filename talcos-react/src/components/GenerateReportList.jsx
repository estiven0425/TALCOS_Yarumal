import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Style from "./styles/generate-report-list.module.css";

function GenerateReportList() {
  const navigate = useNavigate();

  const redirect = (category) => {
    navigate(`/generatereport/${category}`);
  };

  return (
    <>
      <motion.section
        className={Style.generateReportList}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className={Style.generateReportListButton}
          onClick={() => redirect("initialreport")}
          type="button"
        >
          <h2>Informe inicial</h2>
          <img alt="Icono" src="/informe_inicial.svg"></img>
        </button>
        <button
          className={Style.generateReportListButton}
          onClick={() => redirect("noveltyoption")}
          type="button"
        >
          <h2>Novedad</h2>
          <img alt="Icono" src="/novedad.svg"></img>
        </button>
        <button
          className={Style.generateReportListButton}
          onClick={() => redirect("qualitycontrol")}
          type="button"
        >
          <h2>Control de calidad</h2>
          <img alt="Icono" src="/control_calidad.svg"></img>
        </button>
        <button
          className={Style.generateReportListButton}
          onClick={() => redirect("finalreport")}
          type="button"
        >
          <h2>Informe final</h2>
          <img alt="Icono" src="/informe_final.svg"></img>
        </button>
      </motion.section>
    </>
  );
}

export default GenerateReportList;
