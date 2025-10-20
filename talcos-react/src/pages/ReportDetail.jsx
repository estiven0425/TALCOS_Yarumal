import ReportListDetail from "../components/ReportListDetail";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/report.module.css";

function InventoryRawMaterialRegisterDetail() {
  return (
    <ProtectedRoute>
      <section className={Style.report}>
        <ReportListDetail />
      </section>
    </ProtectedRoute>
  );
}

export default InventoryRawMaterialRegisterDetail;
