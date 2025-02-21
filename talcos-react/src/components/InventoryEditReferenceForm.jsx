import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-reference-form.module.css";

function InventoryEditReferenceForm() {
  const [idReferencia, setIdReferencia] = useState("");
  const [nombreReferencia, setNombreReferencia] = useState("");
  const [cantidadReferencia, setCantidadReferencia] = useState("");
  const [clienteReferencia, setClienteReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const reference = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (reference) {
      setIdReferencia(reference.id_referencia);
    }
  }, [reference]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listeditreference");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendEditReference = async (e) => {
    e.preventDefault();

    setIdReferencia(reference.id_referencia);
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/referencias`, {
        id_referencia: idReferencia,
        nombre_referencia:
          nombreReferencia === ""
            ? reference.nombre_referencia
            : nombreReferencia,
        cantidad_referencia:
          cantidadReferencia === ""
            ? reference.cantidad_referencia
            : cantidadReferencia,
        cliente_referencia:
          clienteReferencia === ""
            ? reference.cliente_referencia
            : clienteReferencia,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al editar la referencia. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listeditreference");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryEditReferenceFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Referencia editada con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditReferenceForm}
          onSubmit={sendEditReference}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditReferenceFormHeader}>
            <h1>Complete los datos para editar la referencia</h1>
          </header>
          <main className={Style.inventoryEditReferenceFormMain}>
            <fieldset>
              <label htmlFor="nombreReferencia">Nombre</label>
              <input
                id="nombreReferencia"
                name="nombreReferencia"
                onChange={(e) => setNombreReferencia(e.target.value)}
                placeholder={reference.nombre_referencia}
                type="text"
                value={nombreReferencia}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="cantidadReferencia">Cantidad</label>
              <input
                id="cantidadReferencia"
                name="cantidadReferencia"
                onChange={(e) => setCantidadReferencia(e.target.value)}
                placeholder={reference.cantidad_referencia}
                type="number"
                value={cantidadReferencia}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="clienteReferencia">Cliente</label>
              <input
                id="clienteReferencia"
                name="clienteReferencia"
                onChange={(e) => setClienteReferencia(e.target.value)}
                placeholder={reference.cliente_referencia}
                type="text"
                value={clienteReferencia}
              />
            </fieldset>
          </main>
          <footer className={Style.inventoryEditReferenceFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Editar referencia"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditReferenceFormValidationServer}
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

export default InventoryEditReferenceForm;
