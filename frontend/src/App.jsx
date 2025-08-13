// src/App.jsx
import { Routes, Route, Link } from 'react-router-dom';
// Ahora importamos los componentes individuales con la capitalización correcta
import Index from './pages/Index';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin';
import './App.css';

export default function App() {
  return (
    // Se ha eliminado BrowserRouter de aquí, ya que está en main.jsx
    <div>
      <nav>
        {/* Los enlaces ahora dirigen a las rutas de las páginas individuales */}
        <Link to="/">Inicio</Link> | <Link to="/login">Login</Link> | <Link to="/register">Registro</Link> | <Link to="/admin">Admin</Link>
      </nav>
      
      {/* Aquí van las rutas */}
      <Routes>
        {/* Página principal */}
        <Route path="/" element={<Index />} />
        {/* Página de Login */}
        <Route path="/login" element={<Login />} />
        {/* Página de Registro */}
        <Route path="/register" element={<Register />} />
        {/* Página de Admin */}
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}
