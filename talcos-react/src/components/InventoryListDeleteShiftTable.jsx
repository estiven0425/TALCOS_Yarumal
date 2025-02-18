import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Style from './styles/inventory-list-delete-shift-table.module.css';

function InventoryListDeleteShiftTable() {
    const [turno, setTurno] = useState([]);
    const navigate = useNavigate();
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
    const redirectInventory = () => {
        navigate('/inventoryshift');
    };
    const redirectDeleteInventory = (turno) => {
        navigate('/deleteshift', { state: turno });
    };

    return (
        <>
            <header className={Style.inventoryListDeleteShiftTableHeader}>
                <h1>Seleccione un turno para eliminar</h1>
            </header>
            <main className={Style.inventoryListDeleteShiftTableMain}>
                {turno.length > 0 ? (
                    <motion.table className={Style.inventoryListDeleteShiftTableMainTable} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <thead className={Style.inventoryListDeleteShiftTableMainTableHead}>
                            <tr>
                                <th>Nombre</th>
                                <th>Hora de inicio</th>
                                <th>Hora de finalización</th>
                            </tr>
                        </thead>
                        <tbody className={Style.inventoryListDeleteShiftTableMainTableBody}>
                            {turno.map((turno) => (
                                <tr
                                    key={turno.id_turno}
                                    onClick={() => redirectDeleteInventory(turno)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            redirectDeleteInventory(turno);
                                        }
                                    }}
                                    tabIndex='0'>
                                    <td>{turno.nombre_turno}</td>
                                    <td>{turno.inicio_turno}</td>
                                    <td>{turno.fin_turno}</td>
                                </tr>
                            ))}
                        </tbody>
                    </motion.table>
                ) : (
                        <motion.div className={Style.inventoryListDeleteShiftTableMainAlternative} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                        <h2>No existen turnos</h2>
                    </motion.div>
                )}
            </main>
            <footer className={Style.inventoryListDeleteShiftTableFooter}>
                <button type='button' onClick={() => redirectInventory()}>Volver</button>
            </footer>
        </>
    );
}

export default InventoryListDeleteShiftTable;