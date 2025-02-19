import StaffListEditUserTable from "../components/StaffListEditUserTable";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/staff-list-edit-user.module.css";

function StaffListEditUser() {
  return (
    <ProtectedRoute>
      <section className={Style.staffListEditUser}>
        <StaffListEditUserTable />
      </section>
    </ProtectedRoute>
  );
}

export default StaffListEditUser;
