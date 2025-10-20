import ErrorMain from "../components/ErrorMain";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/error.module.css";

function Error() {
  return (
    <ProtectedRoute>
      <section className={Style.error}>
        <ErrorMain />
      </section>
    </ProtectedRoute>
  );
}

export default Error;
