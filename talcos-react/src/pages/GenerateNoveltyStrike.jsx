import GenerateNoveltyStrikeOption from "./GenerateNoveltyStrikeOption";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyStrike() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyStrikeOption />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrike;
