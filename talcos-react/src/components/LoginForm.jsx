import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/login-form.module.css';

function LoginForm() {
    const [documentoUsuario, setDocumentoUsuario] = useState('');
    const [contrasenaUsuario, setContrasenaUsuario] = useState('');
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    const [loading, setLoading] = useState(false);
    const redirect = useNavigate();
    const localIP = import.meta.env.VITE_LOCAL_IP;

    const validation = () => {
        const errors = {};

        if (!documentoUsuario) {
            errors.documentoUsuario = 'El campo de documento es obligatorio.';
        } else if (documentoUsuario.length < 5) {
            errors.documentoUsuario = 'El campo de documento debe superar los 5 caracteres.';
        } else if (!/^[0-9]+$/.test(documentoUsuario)) {
            errors.documentoUsuario = 'El campo de documento no debe incluir letras.';
        }

        if (!contrasenaUsuario) {
            errors.contrasenaUsuario = 'El campo de contraseña es obligatorio.';
        } else if (contrasenaUsuario.length < 5) {
            errors.contrasenaUsuario = 'La contraseña debe tener al menos 5 caracteres.';
        }

        setValidationError(errors);
        setLoading(false);

        return Object.keys(errors).length === 0;
    };

    const sendLoginForm = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        try {
            const response = await axios.post(`http://${localIP}:3000/login`, {
                documento_usuario: documentoUsuario,
                contrasena_usuario: contrasenaUsuario,
            });

            sessionStorage.setItem('token', response.data.token);
            redirect('/home');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al iniciar sesión. Por favor, inténtelo de nuevo.');
                setLoading(false);
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
                        id='documentoLogin'
                        name='documentoLogin'
                        onChange={(e) => setDocumentoUsuario(e.target.value)}
                        placeholder='Ingresa tu número de cédula'
                        type='text'
                        value={documentoUsuario}
                    />
                    {!validationError.documentoUsuario ? (
                        <></>
                    ) : (
                        <motion.span
                            className={Style.loginFormValidation}
                            initial={{ zoom: 0 }}
                            animate={{ zoom: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {validationError.documentoUsuario}
                        </motion.span>
                    )}
                    <input
                        id='contrasenaLogin'
                        name='contrasenaLogin'
                        onChange={(e) => setContrasenaUsuario(e.target.value)}
                        placeholder='Ingresa tu contraseña'
                        type='password'
                        value={contrasenaUsuario}
                    />
                    {!validationError.contrasenaUsuario ? (
                        <></>
                    ) : (
                        <motion.span
                            className={Style.loginFormValidation}
                            initial={{ zoom: 0 }}
                            animate={{ zoom: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {validationError.contrasenaUsuario}
                        </motion.span>
                    )}
                </main>
                <footer className={Style.loginFormFooter}>
                    <button type='submit'>{loading ? (
                        <div className={Style.loader}></div>
                    ) :
                        'Iniciar sesión'
                    }
                    </button>
                    {!serverError ? (
                        <></>
                    ) : (
                        <motion.span
                            className={Style.loginFormValidation}
                            initial={{ zoom: 0 }}
                            animate={{ zoom: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            {serverError}
                        </motion.span>
                    )}
                </footer>
            </motion.form>
        </>
    );
}

export default LoginForm;