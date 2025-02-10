import NotificationMessageReceived from '../components/NotificationMessageReceived';
import NotificationMessageSend from '../components/NotificationMessageSend';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/notification.module.css';

function Notification() {
    return (
        <ProtectedRoute>
            <section className={Style.Notification}>
                <section className={Style.NotificationMessageReceived}>
                    <NotificationMessageReceived />
                </section>
                <section className={Style.NotificationMessageSend}>
                    <NotificationMessageSend />
                </section>
            </section>
        </ProtectedRoute>
    );
}

export default Notification;