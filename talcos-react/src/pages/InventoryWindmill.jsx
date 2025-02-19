import InventoryWindmillButton from '../components/InventoryWindmillButton';
import InventoryWindmillList from '../components/InventoryWindmillList';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/inventory-windmill.module.css';

function InventoryWindmill() {
    return (
        <ProtectedRoute>
            <section className={Style.inventoryWindmill}>
                <InventoryWindmillButton />
                <main className={Style.inventoryWindmillMain}>
                    <InventoryWindmillList />
                </main>
            </section>
        </ProtectedRoute>
    );
}

export default InventoryWindmill;