import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const localIP = import.meta.env.VITE_LOCAL_IP;
    const [isAuthorized, setIsAuthorized] = useState(false);
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            navigate('/', { replace: true });
            return;
        }

        const verifySession = async () => {
            try {
                const response = await axios.post(`http://${localIP}:3000/login/get`, { token });
                const perfilUsuario = response.data.id_perfil_usuario;
                const restrictions = {
                    1: ['/generatereport', '/fastinventory'],
                    2: ['/staff', '/user', '/createuser', '/listedituser', '/edituser', '/listdeleteuser', '/deleteuser', '/generatereport', '/fastinventory'],
                    3: ['/staff', '/user', '/createuser', '/listedituser', '/edituser', '/listdeleteuser', '/deleteuser', '/report', '/monitoring', '/inventory', '/inventoryshift', '/createshift', '/listeditshift', '/editshift', '/listdeleteshift', '/deleteshift', '/inventorywindmill', '/createwindmill', '/listeditwindmill', '/editwindmill'],
                    4: ['/staff', '/user', '/createuser', '/listedituser', '/edituser', '/listdeleteuser', '/deleteuser', '/report', '/monitoring', '/inventory', '/inventoryshift', '/createshift', '/listeditshift', '/editshift', '/listdeleteshift', '/deleteshift', '/inventorywindmill', '/createwindmill', '/listeditwindmill', '/editwindmill'],
                };

                if (restrictions[perfilUsuario]?.includes(location.pathname)) {
                    navigate('/home', { replace: true });
                    return;
                }

                setIsAuthorized(true);
            } catch (error) {
                console.error('Error al verificar sesión:', error);
                navigate('/', { replace: true });
            }
        };

        verifySession();
    }, [token, localIP, navigate, location.pathname]);

    return isAuthorized ? children : null;
};

ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ProtectedRoute;