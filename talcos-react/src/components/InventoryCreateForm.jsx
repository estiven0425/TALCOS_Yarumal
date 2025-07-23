import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Style from "./styles/inventory-create-form.module.css";

InventoryCreateForm.propTypes = {
  redirectPath: PropTypes.any,
  fields: PropTypes.any,
  endpoint: PropTypes.any,
  nameError: PropTypes.any,
  nameConfirmation: PropTypes.any,
  title: PropTypes.any,
  nameButton: PropTypes.any,
};

function InventoryCreateForm({
  redirectPath,
  fields,
  endpoint,
  nameError,
  nameConfirmation,
  title,
  nameButton,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [sendStatus, setSendStatus] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    if (sendStatus) {
      const timer = setTimeout(() => {
        navigate(`/inventory/inventory${redirectPath}`);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [sendStatus, navigate, redirectPath]);

  const validation = () => {
    const errors = {};

    fields.forEach((field) => {
      if (field.required && !data[field.name]) {
        errors[field.name] =
          field.validationMessage || "Este campo es obligatorio.";
      }
      if (
        field.type === "text" &&
        data[field.name] &&
        !data[field.name].trim()
      ) {
        errors[field.name] = "Este campo solo acepta texto.";
      }
      if (
        field.type === "number" &&
        data[field.name] &&
        !/^\d+(\.\d+)?$/.test(data[field.name])
      ) {
        errors[field.name] = "Este campo solo acepta números.";
      }
    });

    setValidationError(errors);
    setLoading(false);

    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const sendCreate = async (e) => {
    e.preventDefault();

    if (!validation()) {
      return;
    }

    setServerError(null);
    setLoading(true);

    try {
      // noinspection HttpUrlsUsage
      await axios.post(`http://${localIP}:3000/${endpoint}`, data);

      setSendStatus(true);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setServerError(error.response.data.error);

        setLoading(false);
      } else {
        setServerError(
          `Error al crear ${nameError}. Por favor, inténtelo de nuevo.`,
        );
        setLoading(false);
      }
    }
  };

  const redirectInventory = () => {
    navigate(`/inventory/inventory${redirectPath}`);
  };

  // noinspection JSValidateTypes
  return (
    <>
      {sendStatus === true ? (
        <motion.div
          className={Style.inventoryCreateFormAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1>{nameConfirmation} con éxito</h1>
        </motion.div>
      ) : (
        <motion.form
          className={Style.inventoryCreateForm}
          onSubmit={sendCreate}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <header className={Style.inventoryCreateFormHeader}>
            <h1>{title}</h1>
          </header>
          <main className={Style.inventoryCreateFormMain}>
            {fields.map((field) => (
              <fieldset key={field.name}>
                <label htmlFor={field.name}>{field.label}</label>
                <input
                  id={field.name}
                  name={field.name}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  type={field.type}
                  value={data[field.name] || ""}
                />
                {!validationError[field.name] ? (
                  <></>
                ) : (
                  <motion.span
                    className={Style.inventoryCreateFormValidation}
                    initial={{ zoom: 0 }}
                    animate={{ zoom: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {validationError[field.name]}
                  </motion.span>
                )}
              </fieldset>
            ))}
          </main>
          <footer className={Style.inventoryCreateFormFooter}>
            <button onClick={() => redirectInventory()} type="button">
              Cancelar
            </button>
            <button type="submit">
              {loading ? (
                <div className={Style.loader}></div>
              ) : (
                `Crear ${nameButton}`
              )}
            </button>
            {!serverError ? (
              <></>
            ) : (
              <motion.span
                className={Style.inventoryCreateFormValidationServer}
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

export default InventoryCreateForm;
