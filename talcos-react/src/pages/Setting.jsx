import SettingUser from "../components/SettingUser";
import ProtectedRoute from "../utils/ProtectedRoute";

import Style from "./styles/setting.module.css";

function Setting() {
  return (
    <ProtectedRoute>
      <section className={Style.setting}>
        <SettingUser />
      </section>
    </ProtectedRoute>
  );
}

export default Setting;
