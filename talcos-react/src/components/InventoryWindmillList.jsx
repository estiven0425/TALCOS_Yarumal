import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/inventory-windmill-list.module.css';

function InventoryWindmillList() {
    const [molino, setMolino] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getWindmill = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/molinos`);

                setMolino(response.data);
            } catch (error) {
                console.error('Error al obtener los molinos: ', error);
            }
        };

        getWindmill();
    }, [localIP]);

    return (
        <>
            {molino.length > 0 ? (
                <motion.table className={Style.inventoryWindmillListMainTable} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <thead className={Style.inventoryWindmillListMainTableHead}>
                        <tr>
                            <th>Nombre</th>
                            <th>Horómetro</th>
                        </tr>
                    </thead>
                    <tbody className={Style.inventoryWindmillListMainTableBody}>
                        {molino.map((molino) => (
                            <tr key={molino.id_molino}>
                                <td>{molino.nombre_molino}</td>
                                <td>{molino.horometro_molino}</td>
                            </tr>
                        ))}
                    </tbody>
                </motion.table>
            ) : (
                <motion.div className={Style.inventoryWindmillListMainAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2>No existen molinos</h2>
                </motion.div>
            )}
        </>
    );
}

export default InventoryWindmillList;