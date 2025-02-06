import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import Error from './pages/Error';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './pages/Login';
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
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)