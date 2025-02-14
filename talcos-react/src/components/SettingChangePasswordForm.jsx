import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/setting-change-password-form.module.css';

function SettingChangePasswordForm() {
    const [contrasenaUsuario, setContrasenaUsuario] = useState('');
    const [passwordVerify, setpasswordVerify] = useState('');
    const [loading, setLoading] = useState(false);
    const [SendStatus, setSendStatus] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const idUsuario = location.state || null;
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        if (SendStatus) {
            const timer = setTimeout(() => {
                navigate('/setting');
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [SendStatus, idUsuario, navigate]);

    const validation = () => {
        const errors = {};

        if (!contrasenaUsuario) {
            errors.contrasenaUsuario = 'La contraseña del usuario es obligatoria.';
        } else if (contrasenaUsuario.length < 5) {
            errors.contrasenaUsuario = 'La contraseña debe tener al menos 5 caracteres.';
        }
        if (contrasenaUsuario !== passwordVerify) {
            errors.passwordVerify = 'Las contraseñas no coinciden.';
        }

        setValidationError(errors);
        setLoading(false);

        return Object.keys(errors).length === 0;
    };

    const sendChangePassword = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        try {
            await axios.put(`http://${localIP}:3000/usuarios`, {
                id_usuario: idUsuario,
                contrasena_usuario: contrasenaUsuario,
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al cambiar la contraseña. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        }

        setContrasenaUsuario('');
    };
    const redirectSetting = () => {
        navigate('/setting');
    };

    return (
        <>
            {SendStatus === true ? (
                <motion.div className={Style.settingChangePasswordFormAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h1>Contraseña cambiada con éxito</h1>
                </motion.div>
            ) : (
                <motion.form className={Style.settingChangePasswordForm} onSubmit={sendChangePassword} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <header className={Style.settingChangePasswordFormHeader}>
                        <h1>Ingresa la nueva contraseña</h1>
                    </header>
                    <main className={Style.settingChangePasswordFormMain}>
                        <fieldset>
                            <label htmlFor='contrasenaUsuario'>Contraseña</label>
                            <input
                                id='contrasenaUsuario'
                                name='contrasenaUsuario'
                                onChange={(e) => setContrasenaUsuario(e.target.value)}
                                placeholder='Ingresa la nueva contraseña del usuario'
                                type='password'
                                value={contrasenaUsuario}
                            />
                            {!validationError.contrasenaUsuario ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.settingChangePasswordFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.contrasenaUsuario}
                                </motion.span>
                            )}
                        </fieldset>
                        <fieldset>
                            <label htmlFor='passwordVerify'>Confirmar contraseña</label>
                            <input
                                id='passwordVerify'
                                name='passwordVerify'
                                onChange={(e) => setpasswordVerify(e.target.value)}
                                placeholder='Repite la nueva contraseña del usuario'
                                type='password'
                                value={passwordVerify}
                            />
                            {!validationError.passwordVerify ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.settingChangePasswordFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.passwordVerify}
                                </motion.span>
                            )}
                        </fieldset>
                    </main>
                    <footer className={Style.settingChangePasswordFormFooter}>
                        <button onClick={() => redirectSetting()} type='button'>
                            Cancelar
                        </button>
                        <button type='submit'>{loading ? (
                            <div className={Style.loader}></div>
                        ) :
                            'Cambiar contraseña'
                        }
                        </button>
                        {!serverError ? (
                            <></>
                        ) : (
                            <motion.span
                                className={Style.settingChangePasswordFormValidationServer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {serverError}
                            </motion.span>
                        )}
                    </footer>
                </motion.form>
            )}
        </>
    );
}

export default SettingChangePasswordForm;