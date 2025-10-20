import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import axios from "axios";

import Style from "./styles/staff-user-list.module.css";

function StaffUserList() {
  const [usuario, setUsuario] = useState([]);
  const location = useLocation();
  const profile = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getUser = async () => {
      try {
        // noinspection HttpUrlsUsage
        const response = await axios.get(
          `http://${localIP}:3000/usuarios/personalusuario`,
          {
            params: {
              perfil: profile,
            },
          },
        );

        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };

    void getUser();
  }, [localIP, profile]);

  return (
    <>
      {usuario.length > 0 ? (
        <motion.table
          className={Style.staffUserMainTable}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <thead className={Style.staffUserMainTableHead}>
            <tr>
              <th>Nombre</th>
              <th>Documento de identidad</th>
              <th>Teléfono</th>
              <th>Correo electrónico</th>
              <th>Contrato</th>
            </tr>
          </thead>
          <tbody className={Style.staffUserMainTableBody}>
            {usuario.map((usuario) => (
              <tr key={usuario.id_usuario}>
                <td>{usuario.nombre_usuario}</td>
                <td>{usuario.documento_usuario}</td>
                <td>{usuario.telefono_usuario}</td>
                <td>
                  {usuario.correo_usuario !== null
                    ? usuario.correo_usuario
                    : "No aplica"}
                </td>
                <td>
                  {usuario.contrato_usuario !== null
                    ? usuario.contrato_usuario
                    : "No aplica"}
                </td>
              </tr>
            ))}
          </tbody>
        </motion.table>
      ) : (
        <motion.div
          className={Style.staffUserMainAlternative}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2>No existen usuarios</h2>
        </motion.div>
      )}
    </>
  );
}

export default StaffUserList;
