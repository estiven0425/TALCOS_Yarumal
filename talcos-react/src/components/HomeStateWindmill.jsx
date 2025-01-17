import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-state-windmill.module.css';

function HomeStateWindmill() {
    const [homeStateWindmill, setHomeStateWindmill] = useState(1);

    return homeStateWindmill > 0 ? (
        <motion.div className={Style.homeStateWindmill}>
            <header className={Style.homeStateWindmillHeader}>
                <h1>Estado de molinos</h1>
            </header>
            <main className={Style.homeStateWindmillMain}>
                <div>
                    <section className={Style.homeStateWindmillMainPrimary}>
                        <h2>Molino 1</h2>
                        <p>Jaime Patiño</p>
                    </section>
                    <section className={Style.homeStateWindmillMainSecondary}>
                        <p>
                            <i className={`bi bi-check-circle-fill ${Style.homeStateWindmillMainSecondaryIcon}`}></i>
                        </p>
                        <p>35659 Hrs</p>
                    </section>
                </div>
                <div>
                    <section className={Style.homeStateWindmillMainPrimary}>
                        <h2>Molino 2</h2>
                        <p>Jaime Patiño</p>
                    </section>
                    <section className={Style.homeStateWindmillMainSecondary}>
                        <p>
                            <i className={`bi bi-check-circle-fill ${Style.homeStateWindmillMainSecondaryIcon}`}></i>
                        </p>
                        <p>35659 Hrs</p>
                    </section>
                </div>
            </main>
        </motion.div>
    ) : (
        <motion.div className={Style.homeStateWindmillAlternative}>
            <div className={Style.loader}></div>
        </motion.div>
    );
}

export default HomeStateWindmill;