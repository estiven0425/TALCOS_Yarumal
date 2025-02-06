import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff-edit-user.module.css';

function StaffDeleteUser() {
    const [perfil, setPerfil] = useState([]);
    const [idUsuario, setIdUsuario] = useState('');
    const [loading, setLoading] = useState(false);
    const [SendStatus, setSendStatus] = useState(false);
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const user = location.state || null;
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/perfiles/personalperfil`, {
                    params: {
                        perfil: user.perfil_usuario
                    }
                });

                setPerfil(response.data[0]);
                setIdUsuario(user.id_usuario);
            } catch (error) {
                console.error('Error al obtener el perfil: ', error);
            }
        };

        getProfile();
    }, [localIP, user]);
    useEffect(() => {
        if (SendStatus) {
            const timer = setTimeout(() => {
                navigate('/listdeleteuser', { state: perfil.id_perfil });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [SendStatus, navigate, perfil]);

    const singularize = (word) => {
        const exceptions = {
            'superintendentes': 'superintendente',
            'administradores': 'administrador'
        };

        if (exceptions[word]) {
            return exceptions[word];
        }
        if (word.endsWith('ores')) {
            return word.replace(/ores$/, 'or');
        } else if (word.endsWith('ones')) {
            return word.replace(/ones$/, 'ón');
        } else if (word.endsWith('es') && !word.endsWith('iones')) {
            return word.replace(/es$/, '');
        } else if (word.endsWith('s')) {
            return word.replace(/s$/, '');
        }

        return word;
    };
    const sendDeleteUser = async () => {
        setServerError(null);
        setLoading(true);

        try {
            await axios.put(`http://${localIP}:3000/usuarios/eliminarusuario`, {
                id_usuario: idUsuario,
                actividad_usuario: false
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al eliminar el usuario. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        }

    };
    const redirectStaffUser = (id_perfil) => {
        navigate('/listdeleteuser', { state: id_perfil });
    };

    return (
        <ProtectedRoute>
            <motion.section className={Style.staffEditUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {SendStatus === true ? (
                    <div className={Style.staffEditUserFormAlternative}>
                        <h1>{perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'} eliminado con éxito</h1>
                    </div>
                ) : (
                    <div>
                        <main>
                            <h1>¿Seguro que desea eliminar el {perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'} seleccionado?</h1>
                        </main>
                        <footer className={Style.staffEditUserFormFooter}>
                            <button onClick={() => redirectStaffUser(perfil.id_perfil)} type='button'>
                                Cancelar
                                </button>
                                <button type='submit' onClick={() => sendDeleteUser()}>{loading ? (
                                <div className={Style.loader}></div>
                            ) :
                                `Eliminar ${perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'usuario'}`
                            }
                            </button>
                            {!serverError ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidationServer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {serverError}
                                </motion.span>
                            )}
                        </footer>
                    </div>
                )}
            </motion.section>
        </ProtectedRoute>
    );
}

export default StaffDeleteUser;