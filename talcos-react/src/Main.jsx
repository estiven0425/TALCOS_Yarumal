import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login';
import './styles/main.css';

createRoot(document.getElementById('raiz')).render(
    <StrictMode>
        <Login />
    </StrictMode>
)