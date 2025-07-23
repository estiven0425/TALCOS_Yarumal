import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Style from "./styles/staff-user-button.module.css";

function StaffUserButton() {
  const [perfil, setPerfil] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getProfile = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(
          `http://${localIP}:3000/perfiles/personalperfil`,
          {
            params: {
              perfil: profile,
            },
          },
        );

        setPerfil(response.data);
      } catch (error) {
        console.error("Error al obtener el perfil: ", error);
      }
    };

    void getProfile();
  }, [localIP, profile]);

  const singularize = (word) => {
    const exceptions = {
      superintendentes: "superintendente",
      administradores: "administrador",
    };

    if (exceptions[word]) {
      return exceptions[word];
    }
    if (word.endsWith("ores")) {
      return word.replace(/ores$/, "or");
    } else if (word.endsWith("ones")) {
      return word.replace(/ones$/, "ón");
    } else if (word.endsWith("es") && !word.endsWith("iones")) {
      return word.replace(/es$/, "");
    } else if (word.endsWith("s")) {
      return word.replace(/s$/, "");
    }

    return word;
  };

  const redirectCreate = (id_perfil) => {
    navigate("/createuser", { state: id_perfil });
  };

  const redirectEdit = (id_perfil) => {
    navigate("/listedituser", { state: id_perfil });
  };

  const redirectDelete = (id_perfil) => {
    navigate("/listdeleteuser", { state: id_perfil });
  };

  return (
    <>
      {perfil.length > 0 ? (
        <>
          {perfil.map((perfil) => (
            <motion.header
              className={Style.staffUserButtonHeader}
              key={perfil.id_perfil}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <button
                onClick={() => redirectCreate(perfil.id_perfil)}
                type="button"
              >
                <h2>crear {singularize(perfil.nombre_perfil.toLowerCase())}</h2>
                <img alt="Icono" src="/addperson.svg"></img>
              </button>
              <button
                onClick={() => redirectEdit(perfil.id_perfil)}
                type="button"
              >
                <h2>
                  editar {singularize(perfil.nombre_perfil.toLowerCase())}
                </h2>
                <img alt="Icono" src="/editperson.svg"></img>
              </button>
              <button
                onClick={() => redirectDelete(perfil.id_perfil)}
                type="button"
              >
                <h2>
                  eliminar {singularize(perfil.nombre_perfil.toLowerCase())}
                </h2>
                <img alt="Icono" src="/deleteperson.svg"></img>
              </button>
            </motion.header>
          ))}
        </>
      ) : (
        <motion.div
          className={Style.staffUserButtonAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={Style.loader}></div>
        </motion.div>
      )}
    </>
  );
}

export default StaffUserButton;
