import ProtectedRoute from "../utils/ProtectedRoute";
import StaffListDeleteUserTable from "../components/StaffListDeleteUserTable";

import Style from "./styles/staff-list-delete-user.module.css";

function StaffListDeleteUser() {
  return (
    <ProtectedRoute>
      <section className={Style.staffListDeleteUser}>
        <StaffListDeleteUserTable />
      </section>
    </ProtectedRoute>
  );
}

export default StaffListDeleteUser;
