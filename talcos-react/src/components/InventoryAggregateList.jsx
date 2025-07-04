import { es } from "date-fns/locale";
import { format, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import InventoryRawMaterialRegisterAction from "./InventoryRawMaterialRegisterAction";
import Style from "./styles/inventory-aggregate-List.module.css";

function InventoryAggregateList() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItems = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/registros_ap`);
        setItems(response.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getItems();
  }, [localIP]);

  const handleButtonClick = (record) => {
    setSelectedItem(selectedItem === record ? null : record);
  };
  const formatDate = (date) => {
    const formattedDate = format(
      parseISO(date),
      "EEEE dd 'de' MMMM 'del' yyyy",
      {
        locale: es,
      }
    );
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  };
  const groupedItems = items.reduce((groups, item) => {
    const date = item.fecha_registro;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
  const sortedDates = Object.keys(groupedItems).sort((a, b) => {
    return new Date(b) - new Date(a);
  });

  return (
    <>
      {sortedDates.length > 0 ? (
        <>
          <motion.section
            className={Style.inventoryAggregateListPrimary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {sortedDates.map((date) => (
              <article key={date}>
                <section className={Style.inventoryAggregateListPrimaryDate}>
                  <h2>{formatDate(date)}</h2>
                </section>
                <section className={Style.inventoryAggregateListPrimaryobject}>
                  {groupedItems[date].map((record) => (
                    <button
                      key={record.id_registro_ap}
                      onClick={() => handleButtonClick(record)}
                      type="button"
                    >
                      <h2>{record.turno_registro_ap}</h2>
                      <img alt="Icono" src="/doc.svg"></img>
                    </button>
                  ))}
                </section>
              </article>
            ))}
          </motion.section>
          <motion.section
            className={Style.inventoryAggregateListSecondary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InventoryRawMaterialRegisterAction item={selectedItem} />
          </motion.section>
        </>
      ) : (
        <>
          <motion.section
            className={Style.inventoryAggregateListPrimaryAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen registros AP</h2>
          </motion.section>
          <motion.section
            className={Style.inventoryAggregateListSecondary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InventoryRawMaterialRegisterAction />
          </motion.section>
        </>
      )}
    </>
  );
}

export default InventoryAggregateList;
