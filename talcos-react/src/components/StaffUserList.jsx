import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/staff-user-list.module.css';

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
        <>
            {usuario.length > 0 ? (
                <table className={Style.staffUserMainTable}>
                    <thead className={Style.staffUserMainTableHead}>
                        <tr>
                            <th>Nombre</th>
                            <th>Documento de identidad</th>
                            <th>teléfono</th>
                            <th>Correo electrónico</th>
                            <th>Contrato</th>
                        </tr>
                    </thead>
                    <tbody className={Style.staffUserMainTableBody}>
                        {usuario.map((usuario) => (
                            <tr key={usuario.id_usuario}>
                                <td>{usuario.nombre_usuario}</td>
                                <td>{usuario.documento_usuario}</td>
                                <td>{usuario.telefono_usuario}</td>
                                <td>{usuario.correo_usuario !== null ? usuario.correo_usuario : 'No aplica'}</td>
                                <td>{usuario.contrato_usuario !== null ? usuario.contrato_usuario : 'No aplica'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className={Style.staffUserMainTableAlternative}>
                    <div className={Style.loader}></div>
                </div>
            )}
        </>
    );
}

export default StaffUserList;