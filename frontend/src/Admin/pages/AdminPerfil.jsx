import React from 'react';
import AdminHeader from '../components/AdminHeader';
import Perfil from '../../Joven/pages/Perfil';

const AdminPerfil = () => {
  return (
    <div className="admin-perfil-wrapper">
      <AdminHeader />
      <div className="admin-perfil-content">
        <Perfil />
      </div>
    </div>
  );
};

export default AdminPerfil;