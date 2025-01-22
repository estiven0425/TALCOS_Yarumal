import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff.module.css';

function Staff() {
    const [perfil, setPerfil] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/perfiles`);

                setPerfil(response.data);
            } catch (error) {
                console.error("Error al obtener los perfiles: ", error);
            }
        };

        getProfile();
    }, [localIP]);

    return (
        <ProtectedRoute>
            <motion.section className={Style.staff}>
                <header className={Style.staffHeader}>
                    <h1>Seleccione un perfil para acceder a sus usuarios y funciones</h1>
                </header>
                <main className={Style.staffMain}>
                    {perfil.length > 0 ? (
                        <>
                            {perfil.map((perfil) => (
                                <button className={Style.staffMainButton} key={perfil.id_perfil}>
                                    <h2>{perfil.nombre_perfil}</h2>
                                    <img alt="Icono" src={`http://${localIP}:3000/${perfil.icono_perfil}`}></img>
                                </button>
                            ))}
                        </>
                    ) : (
                        <div className={Style.staffMainAlternative}>
                            <div className={Style.loader}></div>
                        </div>
                    )}
                </main>
            </motion.section>
        </ProtectedRoute>
    );
}

export default Staff;