import StaffUserButton from "../components/StaffUserButton";
import StaffUserList from "../components/StaffUserList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/staff-user.module.css";

function StaffUser() {
  return (
    <ProtectedRoute>
      <section className={Style.staffUser}>
        <StaffUserButton />
        <main className={Style.staffUserMain}>
          <StaffUserList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default StaffUser;
