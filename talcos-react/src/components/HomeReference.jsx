import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-reference.module.css';

function HomeReference() {
    const [molino, setMolino] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getWindmill = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/molinos`);

                setMolino(response.data);
            } catch (error) {
                console.error("Error al obtener los molino: ", error);
            }
        };

        getWindmill();
    }, [localIP]);

    return molino.length > 0 ? (
        <motion.div className={Style.homeReference}>
            <header className={Style.homeReferenceHeader}>
                <h1>Referencias en producción</h1>
            </header>
            <main className={Style.homeReferenceMain}>
                {molino.map((molino) => (
                    <div key={molino.id_molino}>
                        <section className={Style.homeReferenceMainPrimary}>
                            <h2>{molino.nombre_molino}</h2>
                            <p>TY - 500 B</p>
                        </section>
                        <section className={Style.homeReferenceMainSecondary}>
                            <p>Bultos de 25 kilogramos</p>
                        </section>
                    </div>
                ))}
            </main>
        </motion.div>
    ) : (
        <motion.div className={Style.homeReferenceAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeReference;