import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-create-reference-form.module.css";

function InventoryCreateReferenceForm() {
  const [nombreReferencia, setNombreReferencia] = useState("");
  const [cantidadReferencia, setCantidadReferencia] = useState("");
  const [clienteReferencia, setClienteReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventoryreference");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const validation = () => {
    const errors = {};

    if (!nombreReferencia) {
      errors.nombreReferencia = "El nombre de la referencia es obligatoria.";
    }
    if (!cantidadReferencia) {
      errors.cantidadReferencia =
        "La cantidad de la referencia es obligatoria.";
    } else if (!/^[0-9]+([.,][0-9]+)?$/.test(cantidadReferencia)) {
      errors.cantidadReferencia =
        "La cantidad de la referencia debe ser un número válido.";
    }

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };
  const sendCreateReference = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      await axios.post(`http://${localIP}:3000/referencias`, {
        nombre_referencia: nombreReferencia,
        cantidad_referencia: cantidadReferencia,
        cliente_referencia: clienteReferencia === "" ? "No registrado" : clienteReferencia,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al crear la referencia. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/inventoryreference");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateReferenceFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Referencia creada con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateReferenceForm}
          onSubmit={sendCreateReference}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateReferenceFormHeader}>
            <h1>Complete los datos para crear una nueva referencia</h1>
          </header>
          <main className={Style.inventoryCreateReferenceFormMain}>
            <fieldset>
              <label htmlFor="nombreReferencia">Nombre</label>
              <input
                id="nombreReferencia"
                name="nombreReferencia"
                onChange={(e) => setNombreReferencia(e.target.value)}
                placeholder="Ingresa el nombre de la referencia"
                type="text"
                value={nombreReferencia}
              />
              {!validationError.nombreReferencia ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateReferenceFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.nombreReferencia}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="cantidadReferencia">Cantidad</label>
              <input
                id="cantidadReferencia"
                name="cantidadReferencia"
                onChange={(e) => setCantidadReferencia(e.target.value)}
                placeholder="Ingresa la cantidad de la referencia en toneladas"
                type="number"
                value={cantidadReferencia}
              />
              {!validationError.cantidadReferencia ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateReferenceFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.cantidadReferencia}
                </motion.span>
              )}
            </fieldset>
            <fieldset>
              <label htmlFor="clienteReferencia">Cliente</label>
              <input
                id="clienteReferencia"
                name="clienteReferencia"
                onChange={(e) => setClienteReferencia(e.target.value)}
                placeholder="Ingresa el cliente de la referencia"
                type="text"
                value={clienteReferencia}
              />
              {!validationError.clienteReferencia ? (
                <></>
              ) : (
                <motion.span
                  className={Style.inventoryCreateReferenceFormValidation}
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError.clienteReferencia}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer className={Style.inventoryCreateReferenceFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Crear referencia"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryCreateReferenceFormValidationServer}
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

export default InventoryCreateReferenceForm;
