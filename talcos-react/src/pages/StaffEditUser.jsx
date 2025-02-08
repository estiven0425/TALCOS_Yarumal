import StaffEditUserForm from '../components/StaffEditUserForm';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff-edit-user.module.css';

function StaffEditUser() {
    return (
        <ProtectedRoute>
            <section className={Style.staffEditUser}>
                <StaffEditUserForm />
            </section>
        </ProtectedRoute>
    );
}

export default StaffEditUser;