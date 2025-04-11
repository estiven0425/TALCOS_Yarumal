import GenerateNoveltyOperatorForm from "../components/GenerateNoveltyOperatorForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyChangeOperator() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyOperatorForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyChangeOperator;
