import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/generate-quality-control-form.module.css";

function GenerateQualityControlForm() {
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/generatereport/generatereportmenu");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);

  const redirectReport = () => {
    navigate("/generatereport/generatereportmenu");
  };

  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={Style.generateQualityControlFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Producto rechazado creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.generateQualityControlForm}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.generateQualityControlFormHeader}>
            <h1>
              Selecciona el molino al que va a realizar el control de calidad y
              complete los datos
            </h1>
          </header>
          <main className={Style.generateQualityControlFormMain}>
            <table
              className={
                Style.inventoryEditReasignedRejectedMaterialTableFormMain
              }
            >
              <thead
                className={
                  Style.inventoryEditReasignedRejectedMaterialTableFormMainHead
                }
              >
                <tr>
                  <th>Referencia</th>
                  <th>Bulto</th>
                </tr>
              </thead>
              <tbody
                className={
                  Style.inventoryEditReasignedRejectedMaterialTableFormMainBody
                }
              >
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
            <fieldset>
              <label htmlFor="molinoControlCalidad">Molino</label>
              <select
                id="molinoControlCalidad"
                name="molinoControlCalidad"
                value=""
              >
                <option value="" disabled>
                  Selecciona un molino
                </option>
              </select>
              {/* {validationError.molinoControlCalidad && (
                <motion.span
                  className={Style.generateQualityControlFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.molinoControlCalidad}
                </motion.span>
              )} */}
            </fieldset>
            <div className={Style.generateQualityControlFormMainAlternative}>
              <fieldset>
                <label htmlFor="cantidadControlCalidad">
                  Cantidad de bultos rechazados
                </label>
                <input
                  id="cantidadControlCalidad"
                  name="cantidadControlCalidad"
                  type="text"
                  placeholder="Ingrese la cantidad de bultos rechazados"
                />
                {/* {!validationError.cantidadControlCalidad ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateNoveltyStrikeStartFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.cantidadControlCalidad}
                </motion.span>
              )} */}
              </fieldset>
              <fieldset>
                <label htmlFor="retencionControlCalidad">Retención</label>
                <input
                  id="retencionControlCalidad"
                  name="retencionControlCalidad"
                  type="text"
                  placeholder="Ingrese la retención obtenida"
                />
                {/* {!validationError.retencionControlCalidad ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateNoveltyStrikeStartFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.retencionControlCalidad}
                </motion.span>
              )} */}
              </fieldset>
            </div>
            <fieldset>
              <label htmlFor="observacionControlCalidad">Observación</label>
              <input
                id="observacionControlCalidad"
                name="observacionControlCalidad"
                type="text"
                placeholder="Ingresa una observación"
              />
              {/* {!validationError.observacionControlCalidad ? (
                <></>
              ) : (
                <motion.span
                  className={Style.generateNoveltyStrikeStartFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.observacionControlCalidad}
                </motion.span>
              )} */}
            </fieldset>
          </main>
          <footer className={Style.generateQualityControlFormFooter}>
            <button onClick={redirectReport} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear control de calidad"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.generateQualityControlFormValidationServer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.form>
      )}
    </>
  );
}

export default GenerateQualityControlForm;
