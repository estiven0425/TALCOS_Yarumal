import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/nav-bar.module.css";

function NavBar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const localIP = import.meta.env.VITE_LOCAL_IP;
  const [perfilUsuario, setPerfilUsuario] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token,
        });
        setPerfilUsuario(response.data.id_perfil_usuario);
      } catch (error) {
        console.error("Error al obtener el perfil del usuario:", error);
      }
    };

    fetchUserProfile();
  }, [localIP]);

  if (perfilUsuario === null) return null;

  return (
    <motion.nav
      className={Style.navBar}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <section>
        <Link
          className={`${Style.navBarStart} ${
            currentPath === "/home" ? Style.active : ""
          }`}
          to="/home"
        >
          <i className={`bi bi-grid-1x2-fill ${Style.navBarIcon}`}></i>
        </Link>

        {perfilUsuario === 1 && (
          <Link
            className={`${Style.navBarStaff} ${
              currentPath === "/staff" ||
              currentPath === "/user" ||
              currentPath === "/createuser" ||
              currentPath === "/edituser" ||
              currentPath === "/listedituser" ||
              currentPath === "/deleteuser" ||
              currentPath === "/listdeleteuser"
                ? Style.active
                : ""
            }`}
            to="/staff"
          >
            <i className={`bi bi-people-fill ${Style.navBarIcon}`}></i>
          </Link>
        )}

        <Link
          className={`${Style.navBarReport} ${
            currentPath === "/report" || currentPath === "/generatereport"
              ? Style.active
              : ""
          }`}
          to={
            perfilUsuario === 3 || perfilUsuario === 4
              ? "/generatereport"
              : "/report"
          }
        >
          <i className={`bi bi-file-earmark-text-fill ${Style.navBarIcon}`}></i>
        </Link>

        {(perfilUsuario === 1 || perfilUsuario === 2) && (
          <Link
            className={`${Style.navBarMonitoring} ${
              currentPath === "/monitoring" ? Style.active : ""
            }`}
            to="/monitoring"
          >
            <i className={`bi bi-graph-up ${Style.navBarIcon}`}></i>
          </Link>
        )}

        <Link
          className={`${Style.navBarInventory} ${
            currentPath === "/inventory" ||
            currentPath === "/inventoryshift" ||
            currentPath === "/createshift" ||
            currentPath === "/listeditshift" ||
            currentPath === "/editshift" ||
            currentPath === "/listdeleteshift" ||
            currentPath === "/deleteshift" ||
            currentPath === "/inventorywindmill" ||
            currentPath === "/createwindmill" ||
            currentPath === "/listeditwindmill" ||
            currentPath === "/editwindmill" ||
            currentPath === "/listdeletewindmill" ||
            currentPath === "/deletewindmill" ||
            currentPath === "/inventoryreference" ||
            currentPath === "/createreference" ||
            currentPath === "/listeditreference" ||
            currentPath === "/editreference" ||
            currentPath === "/listdeletereference" ||
            currentPath === "/deletereference" ||
            currentPath === "/inventorybulk" ||
            currentPath === "/createbulk" ||
            currentPath === "/listeditbulk" ||
            currentPath === "/editbulk" ||
            currentPath === "/listdeletebulk" ||
            currentPath === "/deletebulk" ||
            currentPath === "/inventoryrawmaterial" ||
            currentPath === "/createrawmaterial" ||
            currentPath === "/listeditrawmaterial" ||
            currentPath === "/editrawmaterial" ||
            currentPath === "/listdeleterawmaterial" ||
            currentPath === "/deleterawmaterial" ||
            currentPath === "/fastinventory"
              ? Style.active
              : ""
          }`}
          to={
            perfilUsuario === 3 || perfilUsuario === 4
              ? "/fastinventory"
              : "/inventory"
          }
        >
          <i className={`bi bi-inboxes-fill ${Style.navBarIcon}`}></i>
        </Link>
      </section>

      <section>
        <Link
          className={`${Style.navBarNotification} ${
            currentPath === "/notification" ? Style.active : ""
          }`}
          to="/notification"
        >
          <i className={`bi bi-envelope-fill ${Style.navBarIcon}`}></i>
        </Link>
        <Link
          className={`${Style.navBarSetting} ${
            currentPath === "/setting" || currentPath === "/changepassword"
              ? Style.active
              : ""
          }`}
          to="/setting"
        >
          <i className={`bi bi-gear-fill ${Style.navBarIcon}`}></i>
        </Link>
        <Link
          className={`${Style.navBarLogOut} ${
            currentPath === "/logout" ? Style.active : ""
          }`}
          to="/logout"
        >
          <i className={`bi bi-power ${Style.navBarIcon}`}></i>
        </Link>
      </section>
    </motion.nav>
  );
}

export default NavBar;
