import ProtectedRoute from "../utils/ProtectedRoute";
import SettingChangePasswordForm from "../components/SettingChangePasswordForm";

import Style from "./styles/setting-change-password.module.css";

function SettingChangePassword() {
  return (
    <ProtectedRoute>
      <section className={Style.settingChangePassword}>
        <SettingChangePasswordForm />
      </section>
    </ProtectedRoute>
  );
}

export default SettingChangePassword;
