import GenerateNoveltyWindmillPowerOnForm from "../components/GenerateNoveltyWindmillPowerOnForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyWindmillPowerOnForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyWindmill;
