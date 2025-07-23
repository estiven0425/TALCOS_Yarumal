import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-reasigned-rejected-material-form.module.css";

function InventoryEditReasignedRejectedMaterialForm() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [referencias, setReferencias] = useState([]);
  const [selectedReference, setSelectedReference] = useState("");
  const [validationError, setValidationError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (item) {
      setData(item);
    }
  }, [item]);

  useEffect(() => {
    const getReference = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(`http://${localIP}:3000/referencias`);

        setReferencias(response.data);
      } catch (error) {
        console.error("Error al obtener las referencias: ", error);
      }
    };

    void getReference();
  }, [localIP]);

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate("/inventory/inventoryrejectedmaterial");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate]);

  const handleReferenceChange = (e) => {
    setSelectedReference(e.target.value);
  };

  const sendReasigned = async (e) => {
    e.preventDefault();

    if (!selectedReference) {
      setValidationError("El campo de referencia es obligatorio.");
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      // noinspection HttpUrlsUsage
      await axios.put(
        `http://${localIP}:3000/productos_rechazados/reasignarproductorechazado`,
        {
          id_producto_rechazado: data.id_producto_rechazado,
          cantidad_producto_rechazado: data.cantidad_producto_rechazado,
          referenciaSeleccionada: selectedReference,
        },
      );

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          "Error al reasignar el producto rechazado. Por favor, inténtelo de nuevo.",
        );
        setLoading(false);
      }
    }
  };

  const redirectInventory = () => {
    navigate("/inventory/inventoryrejectedmaterial");
  };

  // noinspection JSValidateTypes
  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={
            Style.inventoryEditReasignedRejectedMaterialFormAlternative
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>Producto rechazado reasignado con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditReasignedRejectedMaterialForm}
          onSubmit={sendReasigned}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header
            className={Style.inventoryEditReasignedRejectedMaterialFormHeader}
          >
            <h1>
              Selecciona la referencia a la que se va a reasignar un producto
              rechazado
            </h1>
          </header>
          <main
            className={Style.inventoryEditReasignedRejectedMaterialFormMain}
          >
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
                  <th>Nombre</th>
                  <th>Cantidad</th>
                  <th>Retención</th>
                </tr>
              </thead>
              <tbody
                className={
                  Style.inventoryEditReasignedRejectedMaterialTableFormMainBody
                }
              >
                <tr key={data.id_producto_rechazado}>
                  <td>{data.nombre_producto_rechazado}</td>
                  <td>{data.cantidad_producto_rechazado}</td>
                  <td>{data.retencion_producto_rechazado}</td>
                </tr>
              </tbody>
            </table>
            <fieldset>
              <label htmlFor="referencia">Referencia</label>
              <select
                id="referencia"
                name="referencia"
                onChange={handleReferenceChange}
                value={selectedReference}
              >
                <option value="" disabled>
                  Selecciona una referencia
                </option>
                {referencias.map((referencia) => (
                  <option
                    key={referencia.id_referencia}
                    value={referencia.id_referencia}
                  >
                    {referencia.nombre_referencia}
                  </option>
                ))}
              </select>
              {validationError && (
                <motion.span
                  className={
                    Style.inventoryEditReasignedRejectedMaterialFormValidation
                  }
                  initial={{ zoom: 0 }}
                  animate={{ zoom: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  {validationError}
                </motion.span>
              )}
            </fieldset>
          </main>
          <footer
            className={Style.inventoryEditReasignedRejectedMaterialFormFooter}
          >
            <button onClick={redirectInventory} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                "Reasignar producto rechazado"
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={
                  Style.inventoryEditReasignedRejectedMaterialFormValidationServer
                }
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

export default InventoryEditReasignedRejectedMaterialForm;
