import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-raw-material-form.module.css";

function InventoryEditRawMaterialForm() {
  const [idMateriaPrima, setIdMateriaPrima] = useState("");
  const [nombreMateriaPrima, setNombreMateriaPrima] = useState("");
  const [cantidadMateriaPrima, setCantidadMateriaPrima] = useState("");
  const [loading, setLoading] = useState(false);
  const [SendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rawMaterial = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (rawMaterial) {
      setIdMateriaPrima(rawMaterial.id_materia_prima);
    }
  }, [rawMaterial]);
  useEffect(() => {
    if (SendStatus) {
      const timer = setTimeout(() => {
        navigate("/listeditrawmaterial");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendEditRawMaterial = async (e) => {
    e.preventDefault();

    setIdMateriaPrima(rawMaterial.id_materia_prima);
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/materias_primas`, {
        id_materia_prima: idMateriaPrima,
        nombre_materia_prima:
          nombreMateriaPrima === ""
            ? rawMaterial.nombre_materia_prima
            : nombreMateriaPrima,
        cantidad_materia_prima:
          cantidadMateriaPrima === ""
            ? rawMaterial.cantidad_materia_prima
            : cantidadMateriaPrima,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al editar la materia prima. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listeditrawmaterial");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryEditRawMaterialFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Materia prima editada con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditRawMaterialForm}
          onSubmit={sendEditRawMaterial}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditRawMaterialFormHeader}>
            <h1>Complete los datos para editar la materia prima</h1>
          </header>
          <main className={Style.inventoryEditRawMaterialFormMain}>
            <fieldset>
              <label htmlFor="nombreMateriaPrima">Nombre</label>
              <input
                id="nombreMateriaPrima"
                name="nombreMateriaPrima"
                onChange={(e) => setNombreMateriaPrima(e.target.value)}
                placeholder={rawMaterial.nombre_materia_prima}
                type="text"
                value={nombreMateriaPrima}
              />
            </fieldset>
            <fieldset>
              <label htmlFor="cantidadMateriaPrima">Cantidad</label>
              <input
                id="cantidadMateriaPrima"
                name="cantidadMateriaPrima"
                onChange={(e) => setCantidadMateriaPrima(e.target.value)}
                placeholder={rawMaterial.cantidad_materia_prima}
                type="number"
                value={cantidadMateriaPrima}
              />
            </fieldset>
          </main>
          <footer className={Style.inventoryEditRawMaterialFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Editar materia prima"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditRawMaterialFormValidationServer}
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

export default InventoryEditRawMaterialForm;
