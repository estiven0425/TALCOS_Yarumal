import GenerateNoveltyReferenceForm from "../components/GenerateNoveltyReferenceForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyChangeReference() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyReferenceForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyChangeReference;
