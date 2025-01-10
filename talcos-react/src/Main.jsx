import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error from './pages/Error';
import Login from './pages/Login';
import Home from './pages/Home';
import Staff from './pages/Staff';
import './styles/main.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path='/'>
                    <Route index element={<Login />} />
                    <Route path='home' element={<Home />} />
                    <Route path='staff' element={<Staff />} />
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)