import LoginForm from "../components/LoginForm";

import Style from "./styles/login.module.css";

function Login() {
  return (
    <main className={Style.login}>
      <LoginForm />
    </main>
  );
}

export default Login;
