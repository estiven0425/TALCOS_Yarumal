import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/staff-list-profile.module.css";

function StaffListProfile() {
  const [perfil, setPerfil] = useState([]);
  const navigate = useNavigate();
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getProfile = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(`http://${localIP}:3000/perfiles`);

        setPerfil(response.data);
      } catch (error) {
        console.error("Error al obtener los perfiles: ", error);
      }
    };

    void getProfile();
  }, [localIP]);

  const redirect = (id_perfil) => {
    navigate("/user", { state: id_perfil });
  };

  // noinspection JSValidateTypes,HttpUrlsUsage
  return (
    <>
      <motion.header
        className={Style.staffListProfileHeader}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1>Seleccione un perfil para acceder a sus usuarios y funciones</h1>
      </motion.header>
      {perfil.length > 0 ? (
        <motion.main
          className={Style.staffListProfileMain}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {perfil.map((perfil) => (
            <button
              className={Style.staffListProfileMainButton}
              key={perfil.id_perfil}
              onClick={() => redirect(perfil.id_perfil)}
              type="button"
            >
              <h2>{perfil.nombre_perfil}</h2>
              <img
                alt="Icono"
                src={`http://${localIP}:3000/${perfil.icono_perfil}`}
              ></img>
            </button>
          ))}
        </motion.main>
      ) : (
        <motion.div
          className={Style.staffListProfileMainAlternative}
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

export default StaffListProfile;
