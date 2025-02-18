import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Error from './pages/Error';
import Home from './pages/Home';
import Header from './components/Header';
import Inventory from './pages/Inventory';
import InventoryDeleteShift from './pages/InventoryDeleteShift';
import InventoryEditShift from './pages/InventoryEditShift';
import InventoryShift from './pages/InventoryShift';
import InventoryListEditShift from './pages/InventoryListEditShift';
import InventoryListDeleteShift from './pages/InventoryListDeleteShift';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Monitoring from './pages/Monitoring';
import Notification from './pages/Notification';
import Report from './pages/Report';
import Setting from './pages/Setting';
import SettingChangePassword from './pages/SettingChangePassword';
import Staff from './pages/Staff';
import StaffCreateUser from './pages/StaffCreateUser';
import StaffDeleteUser from './pages/StaffDeleteUser';
import StaffEditUser from './pages/StaffEditUser';
import StaffListEditUser from './pages/StaffListEditUser';
import StaffListDeleteUser from './pages/StaffListDeleteUser';
import StaffUser from './pages/StaffUser';
import './styles/main.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path='/' element={<Header />}>
                    <Route path='home' element={<Home />} />
                    <Route path='staff' element={<Staff />} />
                    <Route path='user' element={<StaffUser />} />
                    <Route path='createuser' element={<StaffCreateUser />} />
                    <Route path='listedituser' element={<StaffListEditUser />} />
                    <Route path='edituser' element={<StaffEditUser />} />
                    <Route path='listdeleteuser' element={<StaffListDeleteUser />} />
                    <Route path='deleteuser' element={<StaffDeleteUser />} />
                    <Route path='report' element={<Report />} />
                    <Route path='monitoring' element={<Monitoring />} />
                    <Route path='inventory' element={<Inventory />} />
                    <Route path='inventoryshift' element={<InventoryShift />} />
                    <Route path='listeditshift' element={<InventoryListEditShift />} />
                    <Route path='editshift' element={<InventoryEditShift />} />
                    <Route path='listdeleteshift' element={<InventoryListDeleteShift />} />
                    <Route path='deleteshift' element={<InventoryDeleteShift />} />
                    <Route path='notification' element={<Notification />} />
                    <Route path='setting' element={<Setting />} />
                    <Route path='changepassword' element={<SettingChangePassword />} />
                    <Route path='logout' element={<Logout />} />
                </Route>
                <Route path='*' element={<Error />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)