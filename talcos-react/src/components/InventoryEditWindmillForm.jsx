import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-windmill-form.module.css";

function InventoryEditWindmillForm() {
  const [idMolino, setIdMolino] = useState("");
  const [nombreMolino, setNombreMolino] = useState("");
  const [horometroMolino, setHorometroMolino] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const windmill = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (windmill) {
      setIdMolino(windmill.id_molino);
    }
  }, [windmill]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listeditwindmill");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendEditWindmill = async (e) => {
    e.preventDefault();

    setIdMolino(windmill.id_molino);
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/molinos`, {
        id_molino: idMolino,
        nombre_molino:
          nombreMolino === "" ? windmill.nombre_molino : nombreMolino,
        horometro_molino:
          horometroMolino === "" ? windmill.horometro_molino : horometroMolino,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al editar el molino. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listeditwindmill");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryEditWindmillFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Molino editado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditWindmillForm}
          onSubmit={sendEditWindmill}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditWindmillFormHeader}>
            <h1>Complete los datos para editar el molino</h1>
          </header>
          <main className={Style.inventoryEditWindmillFormMain}>
            <fieldset>
              <label htmlFor="nombreMolino">Nombre</label>
              <input
                id="nombreMolino"
                name="nombreMolino"
                onChange={(e) => setNombreMolino(e.target.value)}
                placeholder={windmill.nombre_molino}
                type="text"
                value={nombreMolino}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="horometroMolino">Horómetro</label>
              <input
                id="horometroMolino"
                name="horometroMolino"
                onChange={(e) => setHorometroMolino(e.target.value)}
                placeholder={windmill.horometro_molino}
                type="number"
                value={horometroMolino}
              />
            </fieldset>
          </main>
          <footer className={Style.inventoryEditWindmillFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? <div className={Style.loader}></div> : "Editar molino"}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditWindmillFormValidationServer}
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

export default InventoryEditWindmillForm;
