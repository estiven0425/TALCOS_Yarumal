import InventoryListDeleteShiftTable from '../components/InventoryListDeleteShiftTable';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/inventory-list-delete-shift.module.css';

function InventoryListDeleteShift() {
    return (
        <ProtectedRoute>
            <section className={Style.inventoryListDeleteShift}>
                <InventoryListDeleteShiftTable />
            </section>
        </ProtectedRoute>
    );
}

export default InventoryListDeleteShift;