import React, { useState } from 'react';
import { userProfileData } from '../fake_data/perfilData';
import ProfileHeader from '../components/Perfil/ProfileHeader';
import ProfileInfo from '../components/Perfil/Profileinfo';
import '../../styles/perfil.css';

const Perfil = () => {
  const [userData, setUserData] = useState(userProfileData);
  const [isEditing, setIsEditing] = useState({ 
    nombre: false, 
    correo: false, 
    contrasena: false 
  });

  const handleUpdateUser = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditToggle = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="perfil-container">
      <h1 className="perfil-title">Mi Perfil</h1>
      <div className="perfil-content">
        <ProfileHeader 
          userData={userData}
          onUpdateUser={handleUpdateUser}
        />
        <ProfileInfo 
          userData={userData}
          isEditing={isEditing}
          onUpdateUser={handleUpdateUser}
          onEditToggle={handleEditToggle}
        />
      </div>
    </div>
  );
};

export default Perfil;