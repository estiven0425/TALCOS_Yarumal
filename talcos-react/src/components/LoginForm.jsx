import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import Style from './styles/login-form.module.css';

function LoginForm() {
    const [documentoUsuario, setDocumentoUsuario] = useState('');
    const [contrasenaUsuario, setContrasenaUsuario] = useState('');
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    //const redirect = useNavigate();
    const localIP = import.meta.env.VITE_LOCAL_IP;

    const validation = () => {
        const errors = {};

        if (!documentoUsuario) {
            errors.documentoUsuario = 'El campo de documento es obligatorio.';
        } else if (documentoUsuario.length < 5) {
            errors.documentoUsuario = 'El documento debe tener al menos 5 caracteres.';
        } else if (!/^[0-9]+$/.test(documentoUsuario)) {
            errors.documentoUsuario = 'El documento ingresado debe contener solo números.';
        }

        if (!contrasenaUsuario) {
            errors.contrasenaUsuario = 'El campo de contraseña es obligatorio.';
        } else if (contrasenaUsuario.length < 5) {
            errors.contrasenaUsuario = 'La contraseña debe tener al menos 5 caracteres.';
        }

        setValidationError(errors);

        return Object.keys(errors).length === 0;
    };

    const sendLoginForm = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);

        try {
            const response = await axios.post(`http://${localIP}:3000/login`, {
                documento_usuario: documentoUsuario,
                contrasena_usuario: contrasenaUsuario,
            });

            localStorage.setItem('token', response.data.token);
            //redirect('/home');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
            } else {
                setServerError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
            }
        }

        setContrasenaUsuario('');
    };

    return (
        <>
            <motion.form className={Style.loginForm} onSubmit={sendLoginForm} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <header className={Style.loginFormHeader}>
                    <h1>Ingresa tus datos para acceder</h1>
                </header>
                <main className={Style.loginFormMain}>
                    <input
                        id="documentoLogin"
                        name="documentoLogin"
                        placeholder="Ingresa tu número de cédula"
                        type="text"
                        value={documentoUsuario}
                        onChange={(e) => setDocumentoUsuario(e.target.value)}
                    />
                    <input
                        id="contrasenaLogin"
                        name="contrasenaLogin"
                        placeholder="Ingresa tu contraseña"
                        type="password"
                        value={contrasenaUsuario}
                        onChange={(e) => setContrasenaUsuario(e.target.value)}
                    />
                </main>
                <footer className={Style.loginFormFooter}>
                    <button type="submit">Iniciar sesión</button>
                </footer>
            </motion.form>
            {!validationError.documentoUsuario ? (<></>) : (<span>{validationError.documentoUsuario}</span>)}
            {!validationError.contrasenaUsuario ? (<></>) : (<span>{validationError.contrasenaUsuario}</span>)}
            {!serverError ? (<></>) : (<span>{serverError}</span>)}
        </>
    );
}

export default LoginForm;