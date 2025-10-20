import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PropTypes from "prop-types";

import Style from "./styles/inventory-aggregate-action-detail.module.css";

InventoryAggregateActionDetail.propTypes = {
  item: PropTypes.any,
};

function InventoryAggregateActionDetail({ item }) {
  const navigate = useNavigate();

  const formatDate = (date) => {
    const formattedDate = format(
      parseISO(date),
      "EEEE dd 'de' MMMM 'del' yyyy",
      {
        locale: es,
      },
    );

    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };

  const redirectRegister = () => {
    navigate("/inventory/inventoryaggregate");
  };

  const performance = (produced1, produced2, time) => {
    const prod1 = parseFloat(produced1) || 0;
    const prod2 = parseFloat(produced2) || 0;

    const totalProduced = prod1 + prod2;

    const duration = parseFloat(time) || 1;

    return totalProduced / duration;
  };

  // noinspection JSUnresolvedReference
  return (
    <>
      <motion.main
        className={Style.inventoryAggregateActionDetailMain}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className={Style.inventoryAggregateActionDetailMainEspecial}>
          <h2>{formatDate(item.fecha_registro_ap)}</h2>
        </div>
        <div>
          <h2>Realizado por</h2>
          <p>{item.titular.nombre_usuario}</p>
        </div>
        <div>
          <h2>Mes</h2>
          <p>{item.mes_registro_ap}</p>
        </div>
        <div>
          <h2>Turno</h2>
          <p>{item.turno_registro_ap}</p>
        </div>
        <div>
          <h2>Operador AP</h2>
          <p>{item.operador?.nombre_usuario}</p>
        </div>
        <div>
          <h2>Operador de minicargador</h2>
          <p>{item.carguero?.nombre_usuario}</p>
        </div>
        <div>
          <h2>Total producción roca</h2>
          <p>{item.total_roca_registro_ap} Kg</p>
        </div>
        <div>
          <h2>Total producción grueso</h2>
          <p>{item.total_grueso_registro_ap} Kg</p>
        </div>
        <div>
          <h2>Rendimiento del molino AP</h2>
          <p>
            {performance(
              item.total_roca_registro_ap,
              item.total_grueso_registro_ap,
              item.horometro_fin_registro_ap -
                item.horometro_inicio_registro_ap,
            )}{" "}
            Kg/Hr
          </p>
        </div>
      </motion.main>
      <motion.footer
        className={Style.inventoryAggregateActionDetailFooter}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button type="button" onClick={redirectRegister}>
          Volver
        </button>
      </motion.footer>
    </>
  );
}

export default InventoryAggregateActionDetail;
