import React, { useState } from 'react';
import UserManagement from './UserManagement';
import GuideManagement from './GuideManagement';
import './AdminTabs.css';

const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="admin-tabs-wrapper">
      <div className="nav-tabs">
        <div className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Usuarios
          </button>
        </div>
        <div className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'guides' ? 'active' : ''}`}
            onClick={() => setActiveTab('guides')}
          >
            <i className="fas fa-book-open"></i> Guías de Afrontamiento
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === 'users' && <UserManagement />}
        {activeTab === 'guides' && <GuideManagement />}
      </div>
    </div>
  );
};

export default AdminTabs;