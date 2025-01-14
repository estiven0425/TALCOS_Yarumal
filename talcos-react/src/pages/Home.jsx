import HomeInventary from '../components/homeInventary';
import HomeShift from '../components/HomeShift';
import ProtectedRoute from '../utils/ProtectedRoute';
import Style from './styles/home.module.css';

function Home() {
    return (
        <ProtectedRoute>
            <section className={Style.home}>
                <article className={Style['grid-span-3x1']}>
                    <HomeShift />
                </article>
                <article className={Style['grid-span-2x3']}>
                    <HomeInventary />
                </article>
                <article className={Style['grid-span-2x2'] + ' homeReference'}>
                    <h1>Referencias en producción</h1>
                    <p>Molino 1: TY - 500 B, Bultos de 25 kilogramos</p>
                    <p>Molino 2: TY - 400, Bultos de 40 kilogramos</p>
                    <p>Molino 3: TY - 500 B, Bultos de 1000 kilogramos</p>
                    <p>Molino 4: TY - 500 B, Bultos de 25 kilogramos</p>
                    <p>Molino 5: Super P, Bultos de 750 kilogramos</p>
                </article>
                <article className={Style['grid-span-1x3'] + ' homeStateWindmill'}>
                    <h1>Estado de molinos</h1>
                    <p>Molino 1: Jaime Patiño, 35659 Hrs</p>
                    <p>Molino 2: Camilo Salazar, 32789 Hrs</p>
                    <p>Molino 3: Ricardo Correa, 37265 Hrs</p>
                    <p>Molino 4: Santiago Sanchez, 31406 Hrs</p>
                    <p>Molino 5: Julio Perez, 35061 Hrs</p>
                </article>
                <article className={Style['grid-span-2x1'] + ' homeStateShift'}>
                    <h1>Estado del turno</h1>
                    <p>Informe inicial: ✔️</p>
                    <p>Novedades: 0</p>
                    <p>Informe final: ❌</p>
                </article>
                <article className={Style['grid-span-2x1'] + ' homeStateStaff'}>
                    <h1>Estado de personal</h1>
                    <p>Bob - Cat 2012 BC - 1: Andrés Lopez</p>
                    <p>Bob - Cat 2016 BC - 2: Jairo Garza</p>
                    <p>Mecánicos: Santiago Ortiz, Darío Correa</p>
                </article>
            </section>
        </ProtectedRoute>
    );
}

export default Home;