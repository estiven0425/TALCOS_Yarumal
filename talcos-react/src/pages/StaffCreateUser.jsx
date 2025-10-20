import ProtectedRoute from "../utils/ProtectedRoute";
import StaffCreateUserForm from "../components/StaffCreateUserForm";

import Style from "./styles/staff-create-user.module.css";

function StaffCreateUser() {
  return (
    <ProtectedRoute>
      <section className={Style.staffCreateUser}>
        <StaffCreateUserForm />
      </section>
    </ProtectedRoute>
  );
}

export default StaffCreateUser;
