import GenerateQualityControlForm from "../components/GenerateQualityControlForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-quality-control.module.css";

function GenerateQualityControl() {
  return (
    <ProtectedRoute>
      <section className={Style.generateQualityControl}>
        <GenerateQualityControlForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateQualityControl;
