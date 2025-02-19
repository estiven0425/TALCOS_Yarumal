import InventorytListEditWindmillTable from '../components/InventoryListEditWindmillTable';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/inventory-list-edit-windmill.module.css';

function InventoryListEditWindmill() {
    return (
        <ProtectedRoute>
            <section className={Style.inventorytListEditWindmill}>
                <InventorytListEditWindmillTable />
            </section>
        </ProtectedRoute>
    );
}

export default InventoryListEditWindmill;