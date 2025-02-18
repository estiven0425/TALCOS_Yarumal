import StaffCreateUserForm from '../components/StaffCreateUserForm';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff-create-user.module.css';

function InventoryCreateShift() {
    return (
        <ProtectedRoute>
            <section className={Style.inventoryCreateShift}>
                <StaffCreateUserForm />
            </section>
        </ProtectedRoute>
    );
}

export default InventoryCreateShift;