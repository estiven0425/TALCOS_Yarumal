import { es } from "date-fns/locale";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import Style from "./styles/header.module.css";

function Header() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [nombreUsuario, setNombreUsuario] = useState("");
  const localIP = import.meta.env.VITE_LOCAL_IP;

  useEffect(() => {
    const updateDateTime = () => {
      const currentDateTime = new Date();
      const formattedDate = format(
        currentDateTime,
        "EEEE d 'de' MMMM 'del' yyyy",
        { locale: es }
      );
      const formattedTime = format(currentDateTime, "HH:mm", { locale: es });
      setDate(formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1));
      setTime(formattedTime);
    };
    const interval = setInterval(updateDateTime, 1000);

    updateDateTime();

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    const getUsuario = async () => {
      try {
        const response = await axios.post(`http://${localIP}:3000/login/get`, {
          token: token,
        });

        setNombreUsuario(response.data.nombre_usuario);
      } catch (error) {
        console.error("Error al obtener el usuario: ", error);
      }
    };
    getUsuario();
  }, [localIP]);

  return (
    <>
      <motion.header
        className={Style.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p>{date}</p>
        <p>{time}</p>
        <p className={Style.headerUserName}>{nombreUsuario}</p>
        <NavBar />
      </motion.header>
      <motion.main
        className={Style.main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </motion.main>
    </>
  );
}

export default Header;
