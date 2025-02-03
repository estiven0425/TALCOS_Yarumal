import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff-create-user.module.css';

function StaffCreateUser() {
    const [perfil, setPerfil] = useState([]);
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [documentoUsuario, setDocumentoUsuario] = useState('');
    const [telefonoUsuario, setTelefonoUsuario] = useState('');
    const [correoUsuario, setCorreoUsuario] = useState('');
    const [contratoUsuario, setContratoUsuario] = useState('');
    const [contrasenaUsuario, setContrasenaUsuario] = useState('');
    const [passwordVerify, setpasswordVerify] = useState('');
    const [loading, setLoading] = useState(false);
    const [SendStatus, setSendStatus] = useState(false);
    const [validationError, setValidationError] = useState({});
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const profile = location.state || null;
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getProfile = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/perfiles/personalperfil`, {
                    params: {
                        perfil: profile
                    }
                });

                setPerfil(response.data[0]);
            } catch (error) {
                console.error('Error al obtener el perfil: ', error);
            }
        };

        getProfile();
    }, [localIP, profile]);
    useEffect(() => {
        if (SendStatus) {
            const timer = setTimeout(() => {
                navigate('/user', { state: perfil.id_perfil });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [SendStatus, navigate, perfil.id_perfil]);

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
    const validation = () => {
        const errors = {};

        if (!nombreUsuario) {
            errors.nombreUsuario = "El nombre del usuario es obligatorio.";
        } else if (nombreUsuario.length > 250) {
            errors.nombreUsuario = "El nombre no puede ser mayor a 250 caracteres.";
        }
        if (!documentoUsuario) {
            errors.documentoUsuario = "El documento del usuario es obligatorio.";
        } else if (!/^[0-9]+$/.test(documentoUsuario)) {
            errors.documentoUsuario = "El documento debe ser solo numeros.";
        }
        if (!telefonoUsuario) {
            errors.telefonoUsuario = "El teléfono del usuario es obligatorio.";
        } else if (!/^[0-9]+$/.test(telefonoUsuario)) {
            errors.telefonoUsuario = "El teléfono debe ser solo numeros.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoUsuario)) {
            errors.correoUsuario = "El correo ingresado no tiene un formato válido.";
        }
        if (!/^[0-9]+$/.test(contratoUsuario)) {
            errors.contratoUsuario = "El contrato del usuario debe ser solo numeros.";
        }
        if (!contrasenaUsuario) {
            errors.contrasenaUsuario = "La contraseña del usuario es obligatoria.";
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

    const sendCreateUser = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        try {
            await axios.post(`http://${localIP}:3000/usuarios`, {
                nombre_usuario: nombreUsuario,
                documento_usuario: documentoUsuario,
                telefono_usuario: telefonoUsuario,
                correo_usuario: correoUsuario === '' ? null : correoUsuario,
                contrato_usuario: contratoUsuario === '' ? null : contratoUsuario,
                perfil_usuario: profile,
                contrasena_usuario: contrasenaUsuario,
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al crear el usuario. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        }

        setContrasenaUsuario('');
    };
    const redirectStaffUser = (id_perfil) => {
        navigate('/user', { state: id_perfil });
    };

    return (
        <ProtectedRoute>
            <motion.section className={Style.staffCreateUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                {SendStatus === true ? (
                    <div className={Style.staffCreateUserFormAlternative}>
                        <h1>{perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'} creado con éxtio</h1>
                    </div>
                ) : (
                    <form className={Style.staffCreateUserForm} onSubmit={sendCreateUser}>
                        <header className={Style.staffCreateUserFormHeader}>
                            <h1>Complete los datos para crear un nuevo {perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'}</h1>
                        </header>
                        <main className={Style.staffCreateUserFormMain}>
                            <fieldset>
                                <label htmlFor="nombreUsuario">Nombre</label>
                                <input
                                    id='nombreUsuario'
                                    name='nombreUsuario'
                                    onChange={(e) => setNombreUsuario(e.target.value)}
                                    placeholder='Ingresa el nombre del usuario'
                                    type='text'
                                    value={nombreUsuario}
                                />
                                {!validationError.nombreUsuario ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.nombreUsuario}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="documentoUsuario">Documento de identidad</label>
                                <input
                                    id='documentoUsuario'
                                    name='documentoUsuario'
                                    onChange={(e) => setDocumentoUsuario(e.target.value)}
                                    placeholder='Ingresa el documento del usuario'
                                    type='text'
                                    value={documentoUsuario}
                                />
                                {!validationError.documentoUsuario ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.documentoUsuario}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="telefonoUsuario">Teléfono</label>
                                <input
                                    id='telefonoUsuario'
                                    name='telefonoUsuario'
                                    onChange={(e) => setTelefonoUsuario(e.target.value)}
                                    placeholder='Ingresa el teléfono del usuario'
                                    type='text'
                                    value={telefonoUsuario}
                                />
                                {!validationError.telefonoUsuario ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.telefonoUsuario}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="correoUsuario">Correo electrónico</label>
                                <input
                                    id='correoUsuario'
                                    name='correoUsuario'
                                    onChange={(e) => setCorreoUsuario(e.target.value)}
                                    placeholder='Ingresa el correo del usuario'
                                    type='text'
                                    value={correoUsuario}
                                />
                                {!validationError.correoUsuario ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.correoUsuario}
                                    </motion.span>
                                )}
                            </fieldset>
                                <fieldset className={Style.staffCreateUserFormMainEspecial}>
                                <label htmlFor="contratoUsuario">Contrato</label>
                                <input
                                    id='contratoUsuario'
                                    name='contratoUsuario'
                                    onChange={(e) => setContratoUsuario(e.target.value)}
                                    placeholder='Ingresa el número de contrato del usuario'
                                    type='text'
                                    value={contratoUsuario}
                                />
                            </fieldset>
                            <fieldset>
                                <label htmlFor="contrasenaUsuario">Contraseña</label>
                                <input
                                    id='contrasenaUsuario'
                                    name='contrasenaUsuario'
                                    onChange={(e) => setContrasenaUsuario(e.target.value)}
                                    placeholder='Ingresa la contraseña del usuario'
                                    type='password'
                                    value={contrasenaUsuario}
                                />
                                {!validationError.contrasenaUsuario ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.contrasenaUsuario}
                                    </motion.span>
                                )}
                            </fieldset>
                            <fieldset>
                                <label htmlFor="passwordVerify">Confirmar contraseña</label>
                                <input
                                    id='passwordVerify'
                                    name='passwordVerify'
                                    onChange={(e) => setpasswordVerify(e.target.value)}
                                    placeholder='Repite la contraseña del usuario'
                                    type='password'
                                    value={passwordVerify}
                                />
                                {!validationError.passwordVerify ? (
                                    <></>
                                ) : (
                                    <motion.span
                                        className={Style.staffCreateUserFormValidation}
                                        initial={{ zoom: 0 }}
                                        animate={{ zoom: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {validationError.passwordVerify}
                                    </motion.span>
                                )}
                            </fieldset>
                        </main>
                        <footer className={Style.staffCreateUserFormFooter}>
                            <button onClick={() => redirectStaffUser(perfil.id_perfil)} type='button'>
                                Cancelar
                            </button>
                            <button type='submit'>{loading ? (
                                <div className={Style.loader}></div>
                            ) :
                                `Crear ${perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Perfil'}`
                            }
                            </button>
                            {!serverError ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffCreateUserFormValidationServer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {serverError} aushdiahdasdjasjdado
                                </motion.span>
                            )}
                        </footer>
                    </form>
                )}
            </motion.section>
        </ProtectedRoute>
    );
}

export default StaffCreateUser;