import GenerateNoveltyMechanicForm from "../components/GenerateNoveltyMechanicForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyChangeMechanic() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyMechanicForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyChangeMechanic;
