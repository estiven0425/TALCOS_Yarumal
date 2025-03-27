import { Outlet } from "react-router-dom";
import ProtectedRoute from "../utils/ProtectedRoute";

function GenerateReport() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default GenerateReport;
