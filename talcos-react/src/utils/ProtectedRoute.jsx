import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        const getSession = async () => {
            try {
                await axios.post(`http://${localIP}:3000/login/get`, {
                    token: token,
                });
            } catch (error) {
                console.error('Error al obtener el usuario:', error);
                console.clear();
                navigate('/', { replace: true }, );
            }
        };
        getSession();

    }, [localIP, navigate]);

    return children;
};
export default ProtectedRoute;