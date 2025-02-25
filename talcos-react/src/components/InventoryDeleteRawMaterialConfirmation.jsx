import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-raw-material-confirmation.module.css";

function InventoryDeleteRawMaterialConfirmation() {
  const [idMateriaPrima, setIdMateriaPrima] = useState("");
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
        navigate("/listdeleterawmaterial");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [SendStatus, navigate]);

  const sendDeleteRawMaterial = async () => {
    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/materias_primas/eliminarmateriaprima`, {
        id_materia_prima: idMateriaPrima,
        actividad_materia_prima: false,
      });

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          "Error al eliminar la materia prima. Por favor, inténtelo de nuevo."
        );
        setLoading(false);
      }
    }
  };
  const redirectInventory = () => {
    navigate("/listdeleterawmaterial");
  };

  return (
    <>
      {SendStatus === true ? (
        <motion.div
          className={Style.inventoryDeleteRawMaterialConfirmationAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Materia prima eliminada con éxito</h1>
        </motion.div>
      ) : (
        <motion.div
          className={Style.inventoryDeleteRawMaterialConfirmation}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <main className={Style.inventoryDeleteRawMaterialConfirmationMain}>
            <h1>¿Seguro que desea eliminar la materia prima seleccionada?</h1>
          </main>
          <footer className={Style.inventoryDeleteRawMaterialConfirmationFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit" onClick={() => sendDeleteRawMaterial()}>
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Eliminar materia prima"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryDeleteRawMaterialConfirmationValidationServer
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {serverError}
              </motion.span>
            )}
          </footer>
        </motion.div>
      )}
    </>
  );
}

export default InventoryDeleteRawMaterialConfirmation;
