import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Style from './styles/staff-user-button.module.css';
import AddPerson from '../../public/addperson.svg';
import EditPerson from '../../public/editperson.svg';
import DeletePerson from '../../public/deleteperson.svg';

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
            {perfil.length > 0 ? (
                <>
                    {perfil.map((perfil) => (
                        <header className={Style.staffUserButtonHeader} key={perfil.id_perfil}>
                            <button>
                                <h2>crear {perfil.nombre_perfil.toLowerCase()}</h2>
                                <img alt="Icono" src={AddPerson}></img>
                            </button>
                            <button>
                                <h2>editar {perfil.nombre_perfil.toLowerCase()}</h2>
                                <img alt="Icono" src={EditPerson}></img>
                            </button>
                            <button>
                                <h2>eliminar {perfil.nombre_perfil.toLowerCase()}</h2>
                                <img alt="Icono" src={DeletePerson}></img>
                            </button>
                        </header>
                    ))}
                </>
            ) : (
                <div className={Style.staffUserButtonAlternative}>
                    <div className={Style.loader}></div>
                </div>
            )}
        </>
    );
}

export default StaffUserButton;