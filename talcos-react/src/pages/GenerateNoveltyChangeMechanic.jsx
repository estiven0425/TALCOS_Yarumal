import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyChangeMechanic() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}></section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyChangeMechanic;
