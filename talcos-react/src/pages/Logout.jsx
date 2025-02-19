import LogoutOff from "../components/LogoutOff";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/logout.module.css";

function Logout() {
  return (
    <ProtectedRoute>
      <section className={Style.logout}>
        <LogoutOff />
      </section>
    </ProtectedRoute>
  );
}

export default Logout;
