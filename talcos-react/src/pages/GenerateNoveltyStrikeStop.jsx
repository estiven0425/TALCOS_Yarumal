import GenerateNoveltyStrikeStopList from "../components/GenerateNoveltyStrikeStopList";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-novelty-form.module.css";

function GenerateNoveltyStrikeStop() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyForm}>
        <GenerateNoveltyStrikeStopList />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrikeStop;
