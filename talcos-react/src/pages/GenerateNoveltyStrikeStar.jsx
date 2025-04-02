import GenerateNoveltyStrikeStarForm from "../components/GenerateNoveltyStrikeStarForm";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyStrikeStar() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyStrikeStarForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrikeStar;
