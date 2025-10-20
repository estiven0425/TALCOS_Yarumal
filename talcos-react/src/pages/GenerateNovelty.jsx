import GenerateNoveltyOption from "../components/GenerateNoveltyOption";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/generate-novelty.module.css";

function GenerateNovelty() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNovelty}>
        <GenerateNoveltyOption />
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNovelty;
