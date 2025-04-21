import GenerateNoveltyWindmillOptionButton from "../components/GenerateNoveltyWindmillOptionButton";
import GenerateNoveltyStrikeOptionList from "../components/GenerateNoveltyStrikeOptionList";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/generate-novelty-option.module.css";

function GenerateNoveltyWindmillOption() {
  return (
    <ProtectedRoute>
      <section className={Style.generateNoveltyOption}>
        <GenerateNoveltyWindmillOptionButton />
        <main className={Style.generateNoveltyOptionMain}>
          <GenerateNoveltyStrikeOptionList />
        </main>
      </section>
    </ProtectedRoute>
  );
}

export default GenerateNoveltyWindmillOption;
