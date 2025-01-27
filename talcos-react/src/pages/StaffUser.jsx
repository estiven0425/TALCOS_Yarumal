import { motion } from 'framer-motion';
import StaffUserButton from '../components/StaffUserButton';
import StaffUserList from '../components/StaffUserList';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/staff-user.module.css';

function StaffUser() {
    return (
        <ProtectedRoute>
            <motion.section className={Style.staffUser}>
                <StaffUserButton />
                <main>
                    <StaffUserList />
                </main>
            </motion.section>
        </ProtectedRoute>
    );
}

export default StaffUser;