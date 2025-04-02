import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyChangeFreighter() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}></section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyChangeFreighter;
