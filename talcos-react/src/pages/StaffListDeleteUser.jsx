import StaffListDeleteUserTable from "../components/StaffListDeleteUserTable";
import ProtectedRoute from "../utils/ProtectedRoute";
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
