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

  return (
    <>
      {item ? (
        <>
          <main className={Style.inventoryRawMaterialRegisterActionMain}>
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
              <p>
                {uniqueValues(item, "valor_mp_registro").map((value, index) => (
                  <span key={index}>
                    {value}
                    <br />
                  </span>
                ))}
              </p>
            </div>
            <div>
              <h2>Valor de transporte</h2>
              <p>
                {uniqueValues(item, "valor_t_registro").map((value, index) => (
                  <span key={index}>
                    {value}
                    <br />
                  </span>
                ))}
              </p>
            </div>
          </main>
          <footer
            className={
              Style.inventoryRawMaterialRegisterActionFooterAlternative
            }
          >
            <button type="button">Imprimir registro</button>
            <button type="button">Detalles registro</button>
            <button type="button">Eliminar registro</button>
          </footer>
        </>
      ) : (
        <>
          <header className={Style.inventoryRawMaterialRegisterActionHeader}>
            <h2>Selecciona un registro para ver sus detalles y funciones</h2>
          </header>
          <main
            className={Style.inventoryRawMaterialRegisterActionMainAlternative}
          >
            <h2>O selecciona una de las siguiente opciones</h2>
          </main>
          <footer className={Style.inventoryRawMaterialRegisterActionFooter}>
            <button type="button">Registrar entrada</button>
            <button type="button">Registrar salida</button>
          </footer>
        </>
      )}
    </>
  );
}

export default InventoryRawMaterialRegisterAction;
