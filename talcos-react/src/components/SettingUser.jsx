import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/setting-user.module.css';

function SettingUser() {
    const [isReady, setIsReady] = useState(false);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [documentoUsuario, setDocumentoUsuario] = useState('');
    const [telefonoUsuario, setTelefonoUsuario] = useState('');
    const [correoUsuario, setCorreoUsuario] = useState('');
    const [contratoUsuario, setContratoUsuario] = useState('');
    const [perfilUsuario, setPerfilUsuario] = useState('');
    const [idPerfilUsuario, setIdPerfilUsuario] = useState('');
    const navigate = useNavigate();
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const getUsuario = async () => {
            try {
                const response = await axios.post(`http://${localIP}:3000/login/get`, {
                    token: token,
                });

                setNombreUsuario(response.data.nombre_usuario);
                setDocumentoUsuario(response.data.documento_usuario);
                setTelefonoUsuario(response.data.telefono_usuario);
                setCorreoUsuario(response.data.correo_usuario);
                setContratoUsuario(response.data.contrato_usuario);
                setPerfilUsuario(response.data.perfil_usuario);
                setIdPerfilUsuario(response.data.id_perfil_usuario)
                setIsReady(true);
            } catch (error) {
                console.error('Error al obtener el usuario: ', error);
            }
        };
        getUsuario();
    }, [localIP]);

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
    const redirectUser = (id_usuario) => {
        navigate('/changepassword', { state: id_usuario });
    };

    return (
        <>
            {isReady ? (
                <>
                    <motion.header className={Style.settingUserHeader} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <i className={`bi bi-person-circle ${Style.settingUserHeaderIcon}`}></i>
                        <h2>{nombreUsuario}</h2>
                    </motion.header>
                    <motion.main className={Style.settingUserMain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <table className={Style.settingUserTable}>
                            <thead className={Style.settingUserTableHead}>
                                <tr>
                                    <th>Perfil</th>
                                    <th>Documento de identidad</th>
                                    <th>teléfono</th>
                                    <th>Correo electrónico</th>
                                    <th>Contrato</th>
                                </tr>
                            </thead>
                            <tbody className={Style.settingUserTableBody}>
                                <tr>
                                    <td>{singularize(perfilUsuario)}</td>
                                    <td>{documentoUsuario}</td>
                                    <td>{telefonoUsuario}</td>
                                    <td>{correoUsuario !== null ? correoUsuario : 'No aplica'}</td>
                                    <td>{contratoUsuario !== null ? contratoUsuario : 'No aplica'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </motion.main>
                    <motion.footer className={Style.settingUserFooter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <button type='button' onClick={() => redirectUser(idPerfilUsuario)}>Cambiar contraseña</button>
                    </motion.footer>
                </>
            ) : (
                <motion.div className={Style.settingUserAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2>No se ha obtenido la información del usuario</h2>
                </motion.div>
            )}
        </>
    );
}

export default SettingUser;