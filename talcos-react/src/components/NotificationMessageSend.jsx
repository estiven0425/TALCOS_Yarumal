import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/notification-message-send.module.css';

function NotificationMessageSend() {
    const [message, setMessage] = useState('');
    const [usuario, setUsuario] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [idUsuario, setIdUsuario] = useState('');
    const [loading, setLoading] = useState(false);
    const [SendStatus, setSendStatus] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            setIdUsuario(decodedToken.id_usuario);
        }
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/usuarios`);
                setUsuario(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios: ', error);
            }
        };

        getUser();
    }, [localIP]);


    const validation = () => {
        const errors = {};

        if (message.length >= 1000) {
            errors.message = "El mensaje no puede ser mayor a 1000 caracteres.";
        }

        setValidationError(errors);
        setLoading(false);

        return Object.keys(errors).length === 0;
    };
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        const currentDateTime = new Date();
        const formattedDate = format(currentDateTime, 'yyyy-MM-dd');
        const formattedTime = format(currentDateTime, 'HH:mm:ss', { locale: es });

        setLoading(true);

        try {
            await axios.post(`http://${localIP}:3000/mensajes`, {
                fecha_mensaje: formattedDate,
                hora_mensaje: formattedTime,
                texto_mensaje: message,
                emisor_mensaje: idUsuario,
                receptor_mensaje: selectedUser
            });

            setMessage('');
            setSelectedUser('');
            setSendStatus(true);
            setTimeout(() => {
                setSendStatus(false);
                setLoading(false);
            }, 3000);

        } catch (error) {
            if (error.response?.data?.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al enviar el mensaje. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        }
    };

    return (
        <>
            <motion.header className={Style.notificationMessageSendHeader} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h1>Enviar mensaje a</h1>
            </motion.header>
            <motion.main className={Style.notificationMessageSendMain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {SendStatus === true ? (
                    <div className={Style.notificationMessageSendMainAlternative}>
                        <p>Mensaje enviado con éxito</p>
                    </div>
                ) : (
                    <form className={Style.notificationMessageSendMainForm} onSubmit={sendMessage}>
                        <header>
                            <select name='select' value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                                <option value='' disabled>Seleccionar destinatario</option>
                                {usuario.map((usuario) => (
                                    <option key={usuario.id_usuario} value={usuario.id_usuario}>
                                        {usuario.nombre_usuario}
                                    </option>
                                ))}
                            </select>
                            {!serverError ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.notificationMessageSendMainFormValidationServer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {serverError}
                                </motion.span>
                            )}
                        </header>
                            <main>
                                <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder='Ingresa el mensaje aquí' type='text' />
                            {!validationError.message ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.notificationMessageSendMainFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.message}
                                </motion.span>
                            )}
                            <div>
                                <button type='submit'>{loading ? (
                                    <div className={Style.loader}></div>
                                ) :
                                    <i className={`bi bi-send-fill ${Style.notificationMessageSendMainFormIcon}`}></i>
                                }
                                </button>
                            </div>
                        </main>
                    </form>
                )}
            </motion.main>
        </>
    );
}

export default NotificationMessageSend;