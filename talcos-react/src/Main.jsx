import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Error from './pages/Error';
import Home from './pages/Home';
import Header from './components/Header';
import Login from './pages/Login';
import Staff from './pages/Staff';
import './styles/main.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<Login />} />
                <Route path='/' element={<Header />}>
                    <Route path='home' element={<Home />} />
                    <Route path='staff' element={<Staff />} />
                </Route>
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
)