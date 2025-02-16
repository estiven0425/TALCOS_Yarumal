import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Style from './styles/inventory-list-profile.module.css';

function InventoryList() {
    const navigate = useNavigate();

    const redirect = (category) => {
        navigate(`/inventory/${category}`);
    };

    return (
        <>
            <motion.header className={Style.inventoryListHeader} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <h1>Seleccione una categoría para acceder a su contenido y funciones</h1>
            </motion.header>
            <motion.main className={Style.inventoryListMain} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('turno')} type='button'>
                    <h2>Turnos</h2>
                    <img alt='Icono' src='/turno.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('molino')} type='button'>
                    <h2>Molinos</h2>
                    <img alt='Icono' src='/molino.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('referencia')} type='button'>
                    <h2>Referencias</h2>
                    <img alt='Icono' src='/referencia.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('bulto')} type='button'>
                    <h2>Bultos</h2>
                    <img alt='Icono' src='/bulto.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('materiaprima')} type='button'>
                    <h2>Materia prima</h2>
                    <img alt='Icono' src='/materiaprima.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('productorechazado')} type='button'>
                    <h2>Productos rechazados</h2>
                    <img alt='Icono' src='/productorechazado.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('perfil')} type='button'>
                    <h2>Perfiles</h2>
                    <img alt='Icono' src='/perfil.svg'></img>
                </button>
                <button className={Style.inventoryListMainButton} onClick={() => redirect('bobcat')} type='button'>
                    <h2>Bob - Cat</h2>
                    <img alt='Icono' src='/bobcat.svg'></img>
                </button>
            </motion.main>
        </>
    );
}

export default InventoryList;