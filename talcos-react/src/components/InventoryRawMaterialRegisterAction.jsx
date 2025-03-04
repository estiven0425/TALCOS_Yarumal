import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Style from "./styles/inventory-raw-material-register-action.module.css";

function InventoryRawMaterialRegisterAction({ item }) {
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  const uniqueValues = (records, key) => {
    return [
      ...new Set(
        records.map((record) => {
          const keys = key.split(".");
          let value = record;
          keys.forEach((k) => {
            value = value[k];
          });
          return value;
        })
      ),
    ];
  };

  const sumValues = (records, key) => {
    return records.reduce((total, record) => {
      const keys = key.split(".");
      let value = record;
      keys.forEach((k) => {
        value = value[k];
      });
      return total + parseFloat(value || 0);
    }, 0);
  };

  const redirectCreate = (data) => {
    navigate("/inventory/createregisterrawmaterial", { state: data });
  };

  return (
    <>
      {item ? (
        <>
          <motion.main
            className={Style.inventoryRawMaterialRegisterActionMain}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <h2>Proveedor</h2>
              <p>
                {uniqueValues(item, "proveedor.nombre_usuario").map(
                  (value, index) => (
                    <span key={index}>
                      {value}
                      <br />
                    </span>
                  )
                )}
              </p>
            </div>
            <div>
              <h2>Tipo de registro</h2>
              <p>
                {uniqueValues(item, "tipo_registro").map((value, index) => (
                  <span key={index}>
                    {value}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h2>Valor de la materia prima</h2>
              <p>{sumValues(item, "valor_mp_registro").toFixed(0)}</p>
            </div>
            <div>
              <h2>Valor de transporte</h2>
              <p>{sumValues(item, "valor_t_registro").toFixed(0)}</p>
            </div>
          </motion.main>
          <motion.footer
            className={
              Style.inventoryRawMaterialRegisterActionFooterAlternative
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button">Imprimir registro</button>
            <button type="button">Detalles registro</button>
            <button type="button">Eliminar registro</button>
          </motion.footer>
        </>
      ) : (
        <>
          <motion.header
            className={Style.inventoryRawMaterialRegisterActionHeader}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Selecciona un registro para ver sus detalles y funciones</h2>
          </motion.header>
          <motion.main
            className={Style.inventoryRawMaterialRegisterActionMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>O selecciona una de las siguiente opciones</h2>
          </motion.main>
          <motion.footer
            className={Style.inventoryRawMaterialRegisterActionFooter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <button type="button" onClick={() => redirectCreate("Entrada")}>
              Registrar entrada
            </button>
            <button type="button" onClick={() => redirectCreate("Salida")}>
              Registrar salida
            </button>
          </motion.footer>
        </>
      )}
    </>
  );
}

export default InventoryRawMaterialRegisterAction;
