import { Routes, Route, Link } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Index from './pages/Index';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Admin from './pages/Admin.jsx';
import RecuperarContrasena from './pages/RecuperarContrasena.jsx';
import Perfil from './pages/Perfil.jsx';

import './App.css';

export default function App() {
  return (
    
      <Routes>
        <Route path="/layout" element={<MainLayout />} />
        
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/recuperar" element={<RecuperarContrasena />} />
        <Route path="/perfil" element={<Perfil />} />

      </Routes>
  );
}
