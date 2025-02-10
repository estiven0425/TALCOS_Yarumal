import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/notification-message-received.module.css';

function NotificationMessageReceived() {
    const [mensaje, setMensaje] = useState([]);
    const [idUsuario, setIdUsuario] = useState('');
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const decodedToken = jwtDecode(token);
        const idUserToken = decodedToken.id_usuario;
        setIdUsuario(idUserToken);
    }, []);
    useEffect(() => {
        const getMessage = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/mensajes/notificacionmensaje`, {
                    params: {
                        id_usuario: idUsuario
                    }
                });

                setMensaje(response.data);
            } catch (error) {
                console.error('Error al obtener los mensajes: ', error);
            }
        };

        getMessage();
    }, [idUsuario, localIP]);
    return (
        <>
            <motion.header className={Style.notificationMessageReceivedHeader} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h1>Mensajes recibidos</h1>
            </motion.header>
            <motion.main className={Style.notificationMessageReceivedMain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {mensaje.length > 0 ? (
                    <>
                        {mensaje.map((mensaje) => (
                            <article className={Style.notificationMessageReceivedMainArticle} key={mensaje.id_mensaje}>
                                <section className={Style.notificationMessageReceivedMainArticleHeader}>
                                    <h2>{mensaje.emisor?.nombre_usuario}</h2>
                                    <p>
                                        {mensaje.fecha_mensaje}
                                        <span>
                                            {mensaje.hora_mensaje.slice(0, 5)}
                                        </span>
                                    </p>
                                </section>
                                <section className={Style.notificationMessageReceivedMainArticleMain}>
                                    <p>{mensaje.texto_mensaje}</p>
                                </section>
                            </article>
                        ))}
                    </>
                ) : (
                    <article className={Style.notificationMessageReceivedMainArticleAlternative}>
                        <h2>No se encontraron mensajes, puede recargar la página si cree que se trata de un error.</h2>
                    </article>
                )}
            </motion.main>
        </>
    );
}

export default NotificationMessageReceived;