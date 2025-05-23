import { Outlet } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";

function Monitoring() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default Monitoring;
