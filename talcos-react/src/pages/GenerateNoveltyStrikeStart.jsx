import GenerateNoveltyStrikeStartForm from "../components/GenerateNoveltyStrikeStartForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyStrikeStart() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyStrikeStartForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrikeStart;
