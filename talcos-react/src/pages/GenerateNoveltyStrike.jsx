import GenerateNoveltyStrikeForm from "../components/GenerateNoveltyStrikeForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-initial-report.module.css";

function GenerateNovelty() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNovelty}>
        <GenerateNoveltyStrikeForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNovelty;
