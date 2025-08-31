import React from 'react';
import AdminTabs from '../components/Admin/AdminTabs';
import '../styles/Admin.css';

const Admin = () => {
  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Panel de Administración</h1>
      </div>
      <AdminTabs />
    </div>
  );
};

export default Admin;