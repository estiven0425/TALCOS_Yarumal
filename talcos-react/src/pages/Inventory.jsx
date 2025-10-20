import { Outlet } from "react-router-dom";

import ProtectedRoute from "../utils/ProtectedRoute";

function Inventory() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}

export default Inventory;
