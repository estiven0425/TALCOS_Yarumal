import NotificationMessageReceived from "../components/NotificationMessageReceived";
import NotificationMessageSend from "../components/NotificationMessageSend";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/notification.module.css";

function Notification() {
  return (
    <ProtectedRoute>
      <section className={Style.notification}>
        <section className={Style.notificationMessageReceived}>
          <NotificationMessageReceived />
        </section>
        <section className={Style.notificationMessageSend}>
          <NotificationMessageSend />
        </section>
      </section>
    </ProtectedRoute>
  );
}

export default Notification;
