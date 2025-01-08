import LoginForm from '../components/LoginForm';
import Style from './styles/login.module.css';

function Login() {
    return (
        <section className={Style.login}>
            <LoginForm />
        </section>
    );
}

export default Login;