import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/staff-list-delete-user-table.module.css";

function StaffListDeleteUserTable() {
  const [perfil, setPerfil] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const profile = location.state || null;
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/perfiles/personalperfil`,
          {
            params: {
              perfil: profile,
            },
          }
        );

        setPerfil(response.data[0]);
      } catch (error) {
        console.error("Error al obtener el perfil: ", error);
      }
    };

    getProfile();
  }, [localIP, profile]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://${localIP}:3000/usuarios/personalusuario`,
          {
            params: {
              perfil: profile,
            },
          }
        );

        setUsuario(response.data);
      } catch (error) {
        console.error("Error al obtener los usuarios: ", error);
      }
    };

    getUser();
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
  const redirectUser = (id_perfil) => {
    navigate("/user", { state: id_perfil });
  };
  const redirectDeleteUser = (usuario) => {
    navigate("/deleteuser", { state: usuario });
  };

  return (
    <>
      <header className={Style.staffListDeleteUserTableHeader}>
        <h1>
          Seleccione un{" "}
          {perfil.nombre_perfil
            ? singularize(perfil.nombre_perfil.toLowerCase())
            : "Usuario"}{" "}
          para eliminar
        </h1>
      </header>
      <main className={Style.staffListDeleteUserTableMain}>
        {usuario.length > 0 ? (
          <motion.table
            className={Style.staffListDeleteUserTableMainTable}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <thead className={Style.staffListDeleteUserTableMainTableHead}>
              <tr>
                <th>Nombre</th>
                <th>Documento de identidad</th>
                <th>Teléfono</th>
                <th>Correo electrónico</th>
                <th>Contrato</th>
              </tr>
            </thead>
            <tbody className={Style.staffListDeleteUserTableMainTableBody}>
              {usuario.map((usuario) => (
                <tr
                  key={usuario.id_usuario}
                  onClick={() => redirectDeleteUser(usuario)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      redirectDeleteUser(usuario);
                    }
                  }}
                  tabIndex="0"
                >
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
            className={Style.staffListDeleteUserTableMainAlternative}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>No existen usuarios</h2>
          </motion.div>
        )}
      </main>
      <footer className={Style.staffListDeleteUserTableFooter}>
        <button type="button" onClick={() => redirectUser(perfil.id_perfil)}>
          Volver
        </button>
      </footer>
    </>
  );
}

export default StaffListDeleteUserTable;
