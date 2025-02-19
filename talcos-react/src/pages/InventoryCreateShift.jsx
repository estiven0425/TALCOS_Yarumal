import InventoryCreateShiftForm from '../components/InventoryCreateShiftForm';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/inventory-create-shift.module.css';

function InventoryCreateShift() {
    return (
        <ProtectedRoute>
            <section className={Style.inventoryCreateShift}>
                <InventoryCreateShiftForm />
            </section>
        </ProtectedRoute>
    );
}

export default InventoryCreateShift;