import React from 'react';
import AdminTabs from '../components/AdminTabs';
import '../../styles/admin.css';

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