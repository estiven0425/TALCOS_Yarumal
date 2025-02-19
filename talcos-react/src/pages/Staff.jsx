import StaffListProfile from "../components/StaffListProfile";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/staff.module.css";

function Staff() {
  return (
    <ProtectedRoute>
      <section className={Style.staff}>
        <StaffListProfile />
      </section>
    </ProtectedRoute>
  );
}

export default Staff;
