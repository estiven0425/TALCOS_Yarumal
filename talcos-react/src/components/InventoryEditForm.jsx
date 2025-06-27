import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-edit-form.module.css";

function InventoryEditForm({
  redirectPath,
  fields,
  dataId,
  endpoint,
  nameError,
  nameConfirmation,
  title,
  nameButton,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const item = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (item) {
      const initialData = {};
      fields.forEach((field) => {
        initialData[dataId] = item[dataId] || "";
        initialData[field.name] = item[field.name] || "";
      });
      setData(initialData);
    }
  }, [item, fields]);

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate(`/inventory/listedit${redirectPath}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate, redirectPath]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setData({
      ...data,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const sendEdit = async (e) => {
    e.preventDefault();

    setServerError(null);
    setLoading(true);

    try {
      await axios.put(`http://${localIP}:3000/${endpoint}`, data);
      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);
        setLoading(false);
      } else {
        setServerError(
          `Error al editar ${nameError}. Por favor, inténtelo de nuevo.`
        );
        setLoading(false);
      }
    }
  };

  const redirectInventory = () => {
    navigate(`/inventory/listedit${redirectPath}`);
  };

  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={Style.inventoryEditFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{nameConfirmation} con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryEditForm}
          onSubmit={sendEdit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryEditFormHeader}>
            <h1>{title}</h1>
          </header>
          <main className={Style.inventoryEditFormMain}>
            {fields.map((field) => (
              <fieldset key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  onChange={handleChange}
                  placeholder={item[field.name] || field.placeholder}
                  type={field.type}
                  {...(field.type === "number" && { step: "any" })}
                />
              </fieldset>
            ))}
          </main>
          <footer className={Style.inventoryEditFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                `Editar ${nameButton}`
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryEditFormValidationServer}
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

export default InventoryEditForm;
