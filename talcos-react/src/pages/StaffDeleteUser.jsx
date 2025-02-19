import StaffDeleteUserConfirmation from "../components/StaffDeleteUserConfirmation";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/staff-delete-user.module.css";

function StaffDeleteUser() {
  return (
    <ProtectedRoute>
      <section className={Style.staffDeleteUser}>
        <StaffDeleteUserConfirmation />
      </section>
    </ProtectedRoute>
  );
}

export default StaffDeleteUser;
