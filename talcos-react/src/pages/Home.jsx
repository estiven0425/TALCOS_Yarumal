import HomeFreighter from "../components/HomeFreighter";
import HomeInventary from "../components/homeInventary";
import HomeReference from "../components/HomeReference";
import HomeShift from "../components/HomeShift";
import HomeStateShift from "../components/HomeStateShift";
import HomeStateWindmill from "../components/HomeStateWindmill";
import ProtectedRoute from "../utils/ProtectedRoute";
import Style from "./styles/home.module.css";

function Home() {
  return (
    <ProtectedRoute>
      <section className={Style.home}>
        <article className={Style["grid-span-3x1"]}>
          <HomeShift />
        </article>
        <article className={Style["grid-span-2x3"]}>
          <HomeInventary />
        </article>
        <article className={Style["grid-span-2x2"]}>
          <HomeReference />
        </article>
        <article className={Style["grid-span-1x3"]}>
          <HomeStateWindmill />
        </article>
        <article className={Style["grid-span-2x1"]}>
          <HomeStateShift />
        </article>
        <article className={Style["grid-span-2x1"]}>
          <HomeFreighter />
        </article>
      </section>
    </ProtectedRoute>
  );
}

export default Home;
