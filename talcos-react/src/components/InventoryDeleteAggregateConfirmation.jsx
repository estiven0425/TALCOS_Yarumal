import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Style from "./styles/inventory-delete-confirmation.module.css";

function InventoryDeleteAggregateConfirmation() {
    const [idItem, setIdItem] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sendStatus, setSendStatus] = useState(false);
    const [serverError, setServerError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const data = location.state || null;
    const localIP = import.meta.env.VITE_LOCAL_IP;

    useEffect(() => {
        if (data) {
            setIdItem(data);
        }
    }, [data]);

    useEffect(() => {
        if (sendStatus) {
            const timer = setTimeout(() => {
                navigate("/inventory/inventoryaggregate");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [sendStatus, navigate]);

    const sendDelete = async () => {
        setServerError(null);
        setLoading(true);

        try {
            await axios.put(`http://${localIP}:3000/registros_ap/eliminarregistroap`, {
                ids_registros_ap: idItem,
            });

            setSendStatus(true);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                setServerError(error.response.data.error);
                setLoading(false);
            } else {
                setServerError(
                    "Error al eliminar el registro AP. Por favor, inténtelo de nuevo."
                );
                setLoading(false);
            }
        }
    };

    const redirectInventory = () => {
        navigate("/inventory/inventoryaggregate");
    };

    return (
        <>
            {sendStatus === true ? (
                <motion.div
                    className={Style.inventoryDeleteConfirmationAlternative}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1>Registro AP eliminado con éxito</h1>
                </motion.div>
            ) : (
                <motion.div
                    className={Style.inventoryDeleteConfirmation}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <main className={Style.inventoryDeleteConfirmationMain}>
                        <h1>¿Seguro que desea eliminar el registro AP seleccionado?</h1>
                    </main>
                    <footer className={Style.inventoryDeleteConfirmationFooter}>
                        <button onClick={redirectInventory} type="button">
                            Cancelar
                        </button>
                        <button type="button" onClick={sendDelete}>
                            {loading ? (
                                <div className={Style.loader}></div>
                            ) : (
                                "Eliminar registro AP"
                            )}
                        </button>
                        {!serverError ? (
                            <></>
                        ) : (
                            <motion.span
                                className={Style.inventoryDeleteConfirmationValidationServer}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                {serverError}
                            </motion.span>
                        )}
                    </footer>
                </motion.div>
            )}
        </>
    );
}

export default InventoryDeleteAggregateConfirmation;
