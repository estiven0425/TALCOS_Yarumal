import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Style from './styles/home-inventary.module.css';

function HomeInventary() {
    return (
        <motion.div className={Style.homeInventary}>
            <section className={Style.homeInventaryPrimary}>
                <h1>Inventario de talco total producido</h1>
            </section>
            <section className={Style.homeInventarySecondary}>
                <div>
                    <h2>Super P</h2>
                    <p>68500 Kg</p>
                </div>
                <div>
                    <h2>Super N</h2>
                    <p>10600 Kg</p>
                </div>
                <div>
                    <h2>Extra</h2>
                    <p>15000 Kg</p>
                </div>
                <div>
                    <h2>TY - 10</h2>
                    <p>1800 Kg</p>
                </div>
                <div>
                    <h2>XT - 400</h2>
                    <p>0 Kg</p>
                </div>
                <div>
                    <h2>TY - 400</h2>
                    <p>86200 Kg</p>
                </div>
                <div>
                    <h2>TY - 500</h2>
                    <p>0 Kg</p>
                </div>
                <div>
                    <h2>TY - 500 E</h2>
                    <p>5000 Kg</p>
                </div>
                <div>
                    <h2>TY - 500 B</h2>
                    <p>136300 Kg</p>
                </div>
                <div>
                    <h2>TY - 100</h2>
                    <p>0 Kg</p>
                </div>
                <div>
                    <h2>TY - 500 I</h2>
                    <p>10900 Kg</p>
                </div>
                <div>
                    <h2>Otros</h2>
                    <p>0 Kg</p>
                </div>
            </section>
            <section className={Style.homeInventaryThird}>
                <div>
                    <h2>Talco producido</h2>
                    <p>165000 Kg</p>
                </div>
            </section>
        </motion.div>
    );
}

export default HomeInventary;