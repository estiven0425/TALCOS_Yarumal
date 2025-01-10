import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import "bootstrap-icons/font/bootstrap-icons.css";
import Style from './styles/nav-bar.module.css';

function NavBar() {

    return (
        <motion.nav className={Style.navBar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section>
                <Link className={Style.navBarStart} to='/home'>
                    <i className={`bi bi-grid-1x2-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarStaff} to='/staff'>
                    <i className={`bi bi-people-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarReport} to='/'>
                    <i className={`bi bi-file-earmark-text-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarMonitoring} to='/'>
                    <i className={`bi bi-graph-up ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarInventory} to='/'>
                    <i className={`bi bi-inboxes-fill ${Style.navBarIcon}`}></i>
                </Link>
            </section>
            <section>
                <Link className={Style.navBarNotification} to='/'>
                    <i className={`bi bi-envelope-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarSetting} to='/'>
                    <i className={`bi bi-gear-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={Style.navBarLogOut} to='/'>
                    <i className={`bi bi-power ${Style.navBarIcon}`}></i>
                </Link >
            </section>
        </motion.nav >
    );
}

export default NavBar;