import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/staff-edit-user-form.module.css';

function StaffEditUserForm() {
    const [perfil, setPerfil] = useState([]);
    const [idUsuario, setIdUsuario] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [perfilUsuario, setPerfilUsuario] = useState('');
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
                setPerfilUsuario(user.perfil_usuario);
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
                navigate('/listedituser', { state: perfil.id_perfil });
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
    const validation = () => {
        const errors = {};

        if (nombreUsuario && nombreUsuario.length > 250) {
            errors.nombreUsuario = 'El nombre no puede ser mayor a 250 caracteres.';
        }
        if (documentoUsuario && !/^[0-9]+$/.test(documentoUsuario)) {
            errors.documentoUsuario = 'El documento debe ser solo números.';
        }
        if (telefonoUsuario && !/^[0-9]+$/.test(telefonoUsuario)) {
            errors.telefonoUsuario = 'El teléfono debe ser solo números.';
        }
        if (correoUsuario && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoUsuario)) {
            errors.correoUsuario = 'El correo ingresado no tiene un formato válido.';
        }
        if (contratoUsuario && !/^[0-9]+$/.test(contratoUsuario)) {
            errors.contratoUsuario = 'El contrato del usuario debe ser solo números.';
        }
        if (contrasenaUsuario && contrasenaUsuario.length < 5) {
            errors.contrasenaUsuario = 'La contraseña debe tener al menos 5 caracteres.';
        }
        if (contrasenaUsuario !== passwordVerify) {
            errors.passwordVerify = 'Las contraseñas no coinciden.';
        }

        setValidationError(errors);
        setLoading(false);

        return Object.keys(errors).length === 0;
    };

    const sendEditUser = async (e) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setServerError(null);
        setLoading(true);

        try {
            await axios.put(`http://${localIP}:3000/usuarios`, {
                id_usuario: idUsuario,
                nombre_usuario: nombreUsuario === '' ? user.nombre_usuario : nombreUsuario,
                documento_usuario: documentoUsuario === '' ? user.documento_usuario : documentoUsuario,
                telefono_usuario: telefonoUsuario === '' ? user.telefono_usuario : telefonoUsuario,
                correo_usuario: correoUsuario === '' ? user.correo_usuario : correoUsuario,
                contrato_usuario: contratoUsuario === '' ? user.contrato_usuario : contratoUsuario,
                perfil_usuario: perfilUsuario,
                contrasena_usuario: contrasenaUsuario === '' ? user.contrasena_usuario : contrasenaUsuario,
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError('Error al editar el usuario. Por favor, inténtelo de nuevo.');
                setLoading(false);
            }
        }

        setContrasenaUsuario('');
    };
    const redirectStaffUser = (id_perfil) => {
        navigate('/listedituser', { state: id_perfil });
    };

    return (
        <>
            {SendStatus === true ? (
                <motion.div className={Style.staffEditUserFormAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h1>{perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'} editado con éxito</h1>
                </motion.div>
            ) : (
                <motion.form className={Style.staffEditUserForm} onSubmit={sendEditUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <header className={Style.staffEditUserFormHeader}>
                        <h1>Complete los datos para editar el {perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'Usuario'}</h1>
                    </header>
                    <main className={Style.staffEditUserFormMain}>
                        <fieldset>
                            <label htmlFor='nombreUsuario'>Nombre</label>
                            <input
                                id='nombreUsuario'
                                name='nombreUsuario'
                                onChange={(e) => setNombreUsuario(e.target.value)}
                                placeholder={user.nombre_usuario}
                                type='text'
                                value={nombreUsuario}
                            />
                            {!validationError.nombreUsuario ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.nombreUsuario}
                                </motion.span>
                            )}
                        </fieldset>
                        <fieldset>
                            <label htmlFor='documentoUsuario'>Documento de identidad</label>
                            <input
                                id='documentoUsuario'
                                name='documentoUsuario'
                                onChange={(e) => setDocumentoUsuario(e.target.value)}
                                placeholder={user.documento_usuario}
                                type='text'
                                value={documentoUsuario}
                            />
                            {!validationError.documentoUsuario ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.documentoUsuario}
                                </motion.span>
                            )}
                        </fieldset>
                        <fieldset>
                            <label htmlFor='telefonoUsuario'>Teléfono</label>
                            <input
                                id='telefonoUsuario'
                                name='telefonoUsuario'
                                onChange={(e) => setTelefonoUsuario(e.target.value)}
                                placeholder={user.telefono_usuario}
                                type='text'
                                value={telefonoUsuario}
                            />
                            {!validationError.telefonoUsuario ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.telefonoUsuario}
                                </motion.span>
                            )}
                        </fieldset>
                        <fieldset>
                            <label htmlFor='correoUsuario'>Correo electrónico</label>
                            <input
                                id='correoUsuario'
                                name='correoUsuario'
                                onChange={(e) => setCorreoUsuario(e.target.value)}
                                placeholder={user.correo_usuario ? user.correo_usuario : 'Ingresa el correo del usuario'}
                                type='text'
                                value={correoUsuario}
                            />
                            {!validationError.correoUsuario ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.correoUsuario}
                                </motion.span>
                            )}
                        </fieldset>
                        <fieldset className={Style.staffEditUserFormMainEspecial}>
                            <label htmlFor='contratoUsuario'>Contrato</label>
                            <input
                                id='contratoUsuario'
                                name='contratoUsuario'
                                onChange={(e) => setContratoUsuario(e.target.value)}
                                placeholder={user.contrato_usuario ? user.contrato_usuario : 'Ingresa el número de contrato del usuario'}
                                type='text'
                                value={contratoUsuario}
                            />
                        </fieldset>
                        <fieldset>
                            <label htmlFor='contrasenaUsuario'>Contraseña</label>
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
                                    className={Style.staffEditUserFormValidation}
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
                                placeholder='Repite la contraseña del usuario'
                                type='password'
                                value={passwordVerify}
                            />
                            {!validationError.passwordVerify ? (
                                <></>
                            ) : (
                                <motion.span
                                    className={Style.staffEditUserFormValidation}
                                    initial={{ zoom: 0 }}
                                    animate={{ zoom: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {validationError.passwordVerify}
                                </motion.span>
                            )}
                        </fieldset>
                    </main>
                    <footer className={Style.staffEditUserFormFooter}>
                        <button onClick={() => redirectStaffUser(perfil.id_perfil)} type='button'>
                            Cancelar
                        </button>
                        <button type='submit'>{loading ? (
                            <div className={Style.loader}></div>
                        ) :
                            `Editar ${perfil.nombre_perfil ? singularize(perfil.nombre_perfil.toLowerCase()) : 'usuario'}`
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
                </motion.form>
            )}
        </>
    );
}

export default StaffEditUserForm;