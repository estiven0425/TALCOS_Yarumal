import { es } from "date-fns/locale";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import InventoryRawMaterialRegisterAction from "./InventoryRawMaterialRegisterAction";
import Style from "./styles/inventory-raw-material-register-List.module.css";

function InventoryRawMaterialRegisterList() {
  const [item, setItem] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getItem = async () => {
      try {
        const response = await axios.get(`http://${localIP}:3000/registros`);
        setItem(response.data);
      } catch (error) {
        console.error("Error al obtener los datos: ", error);
      }
    };

    getItem();
  }, [localIP]);

  const handleButtonClick = (records) => {
    if (
      selectedItem &&
      selectedItem[0].id_registro === records[0].id_registro
    ) {
      setSelectedItem(null);
    } else {
      setSelectedItem(records);
    }
  };

  const groupByDateTime = (items) => {
    return items.reduce((groups, item) => {
      const dateTime = `${item.fecha_registro} ${item.hora_registro}`;
      const formattedDate = format(
        new Date(item.fecha_registro),
        "EEEE dd 'de' MMMM 'del' yyyy",
        {
          locale: es,
        }
      );
      const capitalizedDate =
        formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      if (!groups[capitalizedDate]) {
        groups[capitalizedDate] = {};
      }
      if (!groups[capitalizedDate][dateTime]) {
        groups[capitalizedDate][dateTime] = [];
      }
      groups[capitalizedDate][dateTime].push(item);
      return groups;
    }, {});
  };

  return (
    <>
      {item.length > 0 ? (
        <>
          <motion.section
            className={Style.inventoryRawMaterialRegisterListPrimary}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {Object.entries(groupByDateTime(item)).map(
              ([date, dateTimeGroups]) => (
                <article key={date}>
                  <section
                    className={
                      Style.inventoryRawMaterialRegisterListPrimaryDate
                    }
                  >
                    <h2>{date}</h2>
                  </section>
                  <section
                    className={
                      Style.inventoryRawMaterialRegisterListPrimaryobject
                    }
                  >
                    {Object.entries(dateTimeGroups).map(
                      ([dateTime, records]) => (
                        <button
                          key={dateTime}
                          onClick={() => handleButtonClick(records)}
                          type="button"
                        >
                          <h2>{dateTime.split(" ")[1].slice(0, 5)}</h2>
                          <img alt="Icono" src="/doc.svg"></img>
                        </button>
                      )
                    )}
                  </section>
                </article>
              )
            )}
          </motion.section>
          <motion.section
            className={Style.inventoryRawMaterialRegisterListSecondary}
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
            className={Style.inventoryRawMaterialRegisterListPrimaryAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen registros de materia prima</h2>
          </motion.section>
          <motion.section
            className={Style.inventoryRawMaterialRegisterListSecondary}
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

export default InventoryRawMaterialRegisterList;
