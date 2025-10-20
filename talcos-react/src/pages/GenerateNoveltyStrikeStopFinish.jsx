import GenerateNoveltyStrikeStopForm from "../components/GenerateNoveltyStrikeStopForm";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-novelty-strike-stop-finish.module.css";

function GenerateNoveltyStrikeStopFinish() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyStrikeStopFinish}>
        <GenerateNoveltyStrikeStopForm />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrikeStopFinish;
