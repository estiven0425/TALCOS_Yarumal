import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff.module.css';

function Staff() {

    return (
        <ProtectedRoute>
            <section className={Style.staff}>
            </section>
        </ProtectedRoute>
    );
}

export default Staff;