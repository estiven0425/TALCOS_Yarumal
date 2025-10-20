import GenerateReportList from "../components/GenerateReportList";
import GenerateReportShift from "../components/GenerateReportShift";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-report-menu.module.css";

function GenerateReportMenu() {
  return (
    <ProtectedRoute>
      <section className={Style.generateReportMenu}>
        <header className={Style.generateReportMenuStatus}>
          <GenerateReportShift />
        </header>
        <main className={Style.generateReportMenuList}>
          <GenerateReportList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default GenerateReportMenu;
