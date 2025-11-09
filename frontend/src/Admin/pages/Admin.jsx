import React from 'react';
import AdminTabs from '../components/AdminTabs';
import '../../styles/admin.css';
import AdminHeader from '../components/AdminHeader'; // Cambiado a AdminHeader

const Admin = () => {
  return (
    <div className="admin-container">
      <AdminHeader /> {/* Usa el nuevo AdminHeader sin hamburger */}
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
      </div>
      <AdminTabs />
    </div>
  );
};

export default Admin;