import { Outlet } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";

function Report() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default Report;
