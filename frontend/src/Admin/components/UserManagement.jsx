import React, { useState } from 'react';
import ConfirmModal from './ConfirmModal';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Datos de ejemplo
  const users = [
    { id: 1, username: 'usuario_ejemplo1', email: 'usuario1@ejemplo.com', registerDate: '15/03/2023', status: 'active' },
    { id: 2, username: 'usuario_ejemplo2', email: 'usuario2@ejemplo.com', registerDate: '10/02/2023', status: 'active' },
    { id: 3, username: 'usuario_inactivo', email: 'inactivo@ejemplo.com', registerDate: '05/01/2023', status: 'inactive' },
  ];

  const handleDeactivate = (user) => {
    setSelectedUser(user);
    setShowDeactivateModal(true);
  };

  const confirmDeactivate = () => {
    // Lógica para desactivar usuario
    console.log('Desactivando usuario:', selectedUser);
    setShowDeactivateModal(false);
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="users">
      <div className="card-header">
        <h3 className="card-title">Gestión de Usuarios</h3>
        <div className="form-group" style={{marginBottom: 0, width: '300px'}}>
          <input 
            type="text" 
            className="form-control" 
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Fecha Registro</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.registerDate}</td>
              <td>
                <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                  {user.status === 'active' ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                {user.status === 'active' ? (
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeactivate(user)}
                  >
                    <i className="fas fa-user-slash"></i> Desactivar
                  </button>
                ) : (
                  <button className="btn btn-sm btn-success">
                    <i className="fas fa-user-check"></i> Activar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={confirmDeactivate}
        title="Confirmar Desactivación"
        icon="user-slash"
        message="¿Estás seguro de que deseas desactivar esta cuenta? El usuario no podrá acceder al sistema hasta que sea reactivada."
        confirmText="Desactivar"
      />
    </div>
  );
};

export default UserManagement;