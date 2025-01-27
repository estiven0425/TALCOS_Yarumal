import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function StaffUserList() {
    const [usuario, setUsuario] = useState([]);
    const location = useLocation();
    const profile = location.state || null;
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/usuarios/personalusuario`, {
                    params: {
                        perfil: profile
                    }
                });

                setUsuario(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios: ', error);
            }
        };

        getUser();
    }, [localIP, profile]);

    return (
        <table>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Documento de identidad</th>
                    <th>teléfono</th>
                    <th>Correo electrónico</th>
                    <th>Contrato</th>
                    <th>Contraseña</th>
                </tr>
            </thead>
            <tbody>
                {usuario.map((usuario) => (
                    <tr key={usuario.id_usuario}>
                        <td>{usuario.nombre_usuario}</td>
                        <td>{usuario.documento_usuario}</td>
                        <td>{usuario.telefono_usuario}</td>
                        <td>{usuario.correo_usuario}</td>
                        <td>{usuario.contrato_usuario}</td>
                        <td>{usuario.contrasena_usuario}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default StaffUserList;