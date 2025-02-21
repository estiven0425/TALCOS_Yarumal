import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-bulk-form.module.css";

function InventoryCreateBulkForm() {
  const [nombreBulto, setNombreBulto] = useState("");
  const [capacidadBulto, setCapacidadBulto] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventorybulk");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!nombreBulto) {
      errors.nombreBulto = "El nombre del bulto es obligatorio.";
    }
    if (!capacidadBulto) {
      errors.capacidadBulto = "La capacidad del bulto es obligatoria.";
    } else if (!/^[0-9]+$/.test(capacidadBulto)) {
      errors.capacidadBulto =
        "La capacidad del bulto debe ser un número válido.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };
  const sendCreateBulk = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      await axios.post(`http://${localIP}:3000/bultos`, {
        nombre_bulto: nombreBulto,
        capacidad_bulto: capacidadBulto,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al crear el bulto. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/inventorybulk");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateBulkFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Bulto creado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateBulkForm}
          onSubmit={sendCreateBulk}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateBulkFormHeader}>
            <h1>Complete los datos para crear un nuevo bulto</h1>
          </header>
          <main className={Style.inventoryCreateBulkFormMain}>
            <fieldset>
              <label htmlFor="nombreBulto">Nombre</label>
              <input
                id="nombreBulto"
                name="nombreBulto"
                onChange={(e) => setNombreBulto(e.target.value)}
                placeholder="Ingresa el nombre del bulto"
                type="text"
                value={nombreBulto}
              />
              {!validationError.nombreBulto ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateBulkFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.nombreBulto}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="capacidadBulto">Capacidad</label>
              <input
                id="capacidadBulto"
                name="capacidadBulto"
                onChange={(e) => setCapacidadBulto(e.target.value)}
                placeholder="Ingresa la capacidad del bulto en kilogramos"
                type="number"
                value={capacidadBulto}
              />
              {!validationError.capacidadBulto ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateBulkFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.capacidadBulto}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.inventoryCreateBulkFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Crear bulto"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryCreateBulkFormValidationServer}
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

export default InventoryCreateBulkForm;
