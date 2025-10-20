import NotificationMessageReceived from "../components/NotificationMessageReceived";
import NotificationMessageSend from "../components/NotificationMessageSend";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/notification.module.css";

function Notification() {
  return (
    <ProtectedRoute>
      <section className={Style.notification}>
        <aside className={Style.notificationMessageReceived}>
          <NotificationMessageReceived />
        </aside>
        <aside className={Style.notificationMessageSend}>
          <NotificationMessageSend />
        </aside>
      </section>
    </ProtectedRoute>
  );
}

export default Notification;
