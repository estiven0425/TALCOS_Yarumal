import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-bulk-form.module.css";

function InventoryEditBulkForm() {
  const [idBulto, setIdBulto] = useState("");
  const [nombreBulto, setNombreBulto] = useState("");
  const [capacidadBulto, setCapacidadBulto] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const bulk = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (bulk) {
      setIdBulto(bulk.id_bulto);
    }
  }, [bulk]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listeditbulk");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendEditBulk = async (e) => {
    e.preventDefault();

    setIdBulto(bulk.id_bulto);
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/bultos`, {
        id_bulto: idBulto,
        nombre_bulto: nombreBulto === "" ? bulk.nombre_bulto : nombreBulto,
        capacidad_bulto:
          capacidadBulto === "" ? bulk.capacidad_bulto : capacidadBulto,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al editar el bulto. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listeditbulk");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryEditBulkFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Bulto editado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditBulkForm}
          onSubmit={sendEditBulk}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditBulkFormHeader}>
            <h1>Complete los datos para editar el bulto</h1>
          </header>
          <main className={Style.inventoryEditBulkFormMain}>
            <fieldset>
              <label htmlFor="nombreBulto">Nombre</label>
              <input
                id="nombreBulto"
                name="nombreBulto"
                onChange={(e) => setNombreBulto(e.target.value)}
                placeholder={bulk.nombre_bulto}
                type="text"
                value={nombreBulto}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="capacidadBulto">Capacidad</label>
              <input
                id="capacidadBulto"
                name="capacidadBulto"
                onChange={(e) => setCapacidadBulto(e.target.value)}
                placeholder={bulk.capacidad_bulto}
                type="number"
                value={capacidadBulto}
              />
            </fieldset>
          </main>
          <footer className={Style.inventoryEditBulkFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Editar bulto"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditBulkFormValidationServer}
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

export default InventoryEditBulkForm;
