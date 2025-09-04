import { Routes, Route } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout'; // Cambiado a "Layouts" con L mayúscula
import AuthLayout from './Layouts/AuthLayout'; // Cambiado a "Layouts" con L mayúscula
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import RecuperarContrasena from './pages/RecuperarContrasena';
import Perfil from './pages/Perfil';
import Diario from './pages/Diario';
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Rutas con layout de autenticación (sin sidebar) */}
      <Route path="/login" element={
        <AuthLayout>
          <Login />
        </AuthLayout>
      } />
      <Route path="/register" element={
        <AuthLayout>
          <Register />
        </AuthLayout>
      } />
      <Route path="/recuperar" element={
        <AuthLayout>
          <RecuperarContrasena />
        </AuthLayout>
      } />
      
      {/* Rutas con layout principal (con sidebar y header) */}
      <Route path="/" element={
        <MainLayout>
          <Home />
        </MainLayout>
      } />
      <Route path="/perfil" element={
        <MainLayout>
          <Perfil />
        </MainLayout>
      } />
      <Route path="/diario" element={
        <MainLayout>
          <Diario />
        </MainLayout>
      } />
      
      {/* Ruta para la página de inicio pública */}
      <Route path="/index" element={<Index />} />
    </Routes>
  );
}

export default App;