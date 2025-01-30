import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Style from './styles/nav-bar.module.css';

function NavBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <motion.nav className={Style.navBar} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <section>
                <Link className={`${Style.navBarStart} ${currentPath === '/home' ? Style.active : ''}`} to='/home'>
                    <i className={`bi bi-grid-1x2-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarStaff} ${currentPath === '/staff' || currentPath === '/user' || currentPath === '/createuser' ? Style.active : ''}`} to='/staff'>
                    <i className={`bi bi-people-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarReport} ${currentPath === '/report' ? Style.active : ''}`} to='/report'>
                    <i className={`bi bi-file-earmark-text-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarMonitoring} ${currentPath === '/monitoring' ? Style.active : ''}`} to='/monitoring'>
                    <i className={`bi bi-graph-up ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarInventory} ${currentPath === '/inventory' ? Style.active : ''}`} to='/inventory'>
                    <i className={`bi bi-inboxes-fill ${Style.navBarIcon}`}></i>
                </Link>
            </section>
            <section>
                <Link className={`${Style.navBarNotification} ${currentPath === '/notification' ? Style.active : ''}`} to='/notification'>
                    <i className={`bi bi-envelope-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarSetting} ${currentPath === '/setting' ? Style.active : ''}`} to='/setting'>
                    <i className={`bi bi-gear-fill ${Style.navBarIcon}`}></i>
                </Link>
                <Link className={`${Style.navBarLogOut} ${currentPath === '/logout' ? Style.active : ''}`} to='/logout'>
                    <i className={`bi bi-power ${Style.navBarIcon}`}></i>
                </Link>
            </section>
        </motion.nav >
    );
}

export default NavBar;