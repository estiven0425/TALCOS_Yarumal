import ProtectedRoute from '../utils/ProtectedRoute';
import Header from '../components/Header';
import NavBar from '../components/NavBar';
import Style from './styles/home.module.css';

function Home() {
    return (
        <ProtectedRoute>
            <section className={Style.home}>
                <Header />
                <main className={Style.homeMain}>
                    <NavBar />
                    <section>
                        <article></article>
                        <article></article>
                        <article></article>
                        <article></article>
                        <article></article>
                        <article></article>
                    </section>
                </main>
            </section>
        </ProtectedRoute>
    );
}

export default Home;