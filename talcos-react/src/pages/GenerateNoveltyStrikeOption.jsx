import GenerateNoveltyStrikeOptionButton from "../components/GenerateNoveltyStrikeOptionButton";
import GenerateNoveltyStrikeOptionList from "../components/GenerateNoveltyStrikeOptionList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-strike-option.module.css";

function GenerateNoveltyStrikeOption() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyStrikeOption}>
        <GenerateNoveltyStrikeOptionButton />
        <main className={Style.generateNoveltyStrikeOptionMain}>
          <GenerateNoveltyStrikeOptionList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyStrikeOption;
