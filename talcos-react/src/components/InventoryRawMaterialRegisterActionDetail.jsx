import { es } from "date-fns/locale";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Style from "./styles/inventory-raw-material-register-action-detail.module.css";

function InventoryRawMaterialRegisterActionDetail({ item }) {
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = format(date, "EEEE d 'de' MMMM 'del' yyyy", {
      locale: es,
    });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const redirectRegister = () => {
    navigate("/inventory/registerrawmaterial");
  };

  return (
    <>
      <motion.main
        className={Style.inventoryRawMaterialRegisterActionDetailMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2>{item.length > 0 && formatDate(item[0].fecha_registro)}</h2>
        </div>
        <div>
          <h2>Registro de materia prima</h2>
          <p>N° {item.length > 0 && `${item[0].id_registro}`}</p>
        </div>
        <div>
          <h2>Realizado por</h2>
          <p>{item.length > 0 && `${item[0].titular.nombre_usuario}`}</p>
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
        className={Style.inventoryRawMaterialRegisterActionDetailFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button">Imprimir registro</button>
        <button type="button" onClick={redirectRegister}>
          Volver
        </button>
      </motion.footer>
    </>
  );
}

export default InventoryRawMaterialRegisterActionDetail;
