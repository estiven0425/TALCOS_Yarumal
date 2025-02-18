import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/inventory-shift-list.module.css';

function InventoryShiftList() {
    const [turno, setTurno] = useState([]);
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        const getShift = async () => {
            try {
                const response = await axios.get(`http://${localIP}:3000/turnos`);

                setTurno(response.data);
            } catch (error) {
                console.error('Error al obtener los turnos: ', error);
            }
        };

        getShift();
    }, [localIP]);

    return (
        <>
            {turno.length > 0 ? (
                <motion.table className={Style.inventoryShiftListMainTable} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <thead className={Style.inventoryShiftListMainTableHead}>
                        <tr>
                            <th>Nombre</th>
                            <th>Hora de inicio</th>
                            <th>Hora de finalización</th>
                        </tr>
                    </thead>
                    <tbody className={Style.inventoryShiftListMainTableBody}>
                        {turno.map((turno) => (
                            <tr key={turno.id_turno}>
                                <td>{turno.nombre_turno}</td>
                                <td>{turno.inicio_turno}</td>
                                <td>{turno.fin_turno}</td>
                            </tr>
                        ))}
                    </tbody>
                </motion.table>
            ) : (
                <motion.div className={Style.inventoryShiftListMainAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h2>No existen turnos</h2>
                </motion.div>
            )}
        </>
    );
}

export default InventoryShiftList;