import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff.module.css';

function Staff() {

    return (
        <ProtectedRoute>
            <section className={Style.staff}>
                <h1>Personal</h1>
            </section>
        </ProtectedRoute>
    );
}

export default Staff;