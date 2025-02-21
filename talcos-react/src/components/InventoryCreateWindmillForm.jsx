import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-windmill-form.module.css";

function InventoryCreateWindmillForm() {
  const [nombreMolino, setNombreMolino] = useState("");
  const [horometroMolino, setHorometroMolino] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventorywindmill");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!nombreMolino) {
      errors.nombreMolino = "El nombre del molino es obligatorio.";
    }
    if (!horometroMolino) {
      errors.horometroMolino = "El horómetro del molino es obligatorio.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };
  const sendCreateWindmill = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      await axios.post(`http://${localIP}:3000/molinos`, {
        nombre_molino: nombreMolino,
        horometro_molino: horometroMolino,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al crear el molino. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/inventorywindmill");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateWindmillFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Molino creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateWindmillForm}
          onSubmit={sendCreateWindmill}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateWindmillFormHeader}>
            <h1>Complete los datos para crear un nuevo molino</h1>
          </header>
          <main className={Style.inventoryCreateWindmillFormMain}>
            <fieldset>
              <label htmlFor="nombreMolino">Nombre</label>
              <input
                id="nombreMolino"
                name="nombreMolino"
                onChange={(e) => setNombreMolino(e.target.value)}
                placeholder="Ingresa el nombre del molino"
                type="text"
                value={nombreMolino}
              />
              {!validationError.nombreMolino ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateWindmillFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.nombreMolino}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="horometroMolino">Horómetro</label>
              <input
                id="horometroMolino"
                name="horometroMolino"
                onChange={(e) => setHorometroMolino(e.target.value)}
                placeholder="Ingresa el horómetro del molino"
                type="number"
                value={horometroMolino}
              />
              {!validationError.horometroMolino ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateWindmillFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.horometroMolino}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.inventoryCreateWindmillFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Crear molino"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryCreateWindmillFormValidationServer}
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

export default InventoryCreateWindmillForm;
