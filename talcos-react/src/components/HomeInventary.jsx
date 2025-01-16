import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-inventary.module.css';

function HomeInventary() {
    const [referencia, setReferencia] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getReference = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/referencias`);

                setReferencia(response.data);
            } catch (error) {
                console.error("Error al obtener las referencias: ", error);
            }
        };

        getReference();
    }, [localIP]);

    const talcProduced = referencia.reduce((total, referencia) => total + referencia.cantidad_referencia, 0);

    return referencia.length > 0 ? (
        <motion.div className={Style.homeInventary}>
            <header className={Style.homeInventaryHeader}>
                <h1>Inventario de talco total producido</h1>
            </header>
            <main className={Style.homeInventaryMain}>
                {referencia.map((referencia) => (
                    <div key={referencia.id_referencia}>
                        <h2>{referencia.nombre_referencia}</h2>
                        <p>{referencia.cantidad_referencia} Kg</p>
                    </div>
                ))}
            </main>
            <footer className={Style.homeInventaryFooter}>
                <div>
                    <h2>Talco producido</h2>
                    <p>{talcProduced} Kg</p>
                </div>
            </footer>
        </motion.div>
    ) : (
        <motion.div className={Style.homeInventaryAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeInventary;