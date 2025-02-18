import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Style from './styles/inventory-shift-button.module.css';

function InventoryShiftButton() {
    const navigate = useNavigate();
    const redirectCreate = () => {
        navigate('/createshift');
    };
    const redirectEdit = () => {
        navigate('/listeditshift');
    };
    const redirectDelete = () => {
        navigate('/listdeleteshift');
    };

    return (
        <>
            <motion.header
                className={Style.inventoryShiftButtonHeader}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <button onClick={() => redirectCreate()} type='button'>
                    <h2>crear turno</h2>
                    <img alt='Icono' src='/add.svg'></img>
                </button>
                <button onClick={() => redirectEdit()} type='button'>
                    <h2>editar turno</h2>
                    <img alt='Icono' src='/edit.svg'></img>
                </button>
                <button onClick={() => redirectDelete()} type='button'>
                    <h2>eliminar turno</h2>
                    <img alt='Icono' src='/delete.svg'></img>
                </button>
            </motion.header>
        </>
    );
}

export default InventoryShiftButton;