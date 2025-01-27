import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function StaffUserButton() {
    const [perfil, setPerfil] = useState([]);
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

                setPerfil(response.data);
            } catch (error) {
                console.error('Error al obtener el perfil: ', error);
            }
        };

        getProfile();
    }, [localIP, profile]);

    return (
        <>
            {perfil.map((perfil) => (
                <header key={perfil.id_perfil}>
                    <button>crear {perfil.nombre_perfil}</button>
                    <button>editar {perfil.nombre_perfil}</button>
                    <button>eliminar {perfil.nombre_perfil}</button>
                </header>
            ))}
        </>
    );
}

export default StaffUserButton;