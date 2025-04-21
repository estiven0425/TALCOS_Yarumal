import GenerateNoveltyWindmillOption from "./GenerateNoveltyWindmillOption";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyWindmill() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyWindmillOption />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyWindmill;
