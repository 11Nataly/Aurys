// src/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { listarUsuarios, cambiarEstadoUsuario } from "../../services/usuariosService";
import ConfirmModal from "./ConfirmModal";
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const data = await listarUsuarios();
      const formatted = data.map((u) => ({
        id: u.id,
        username: u.nombre,
        email: u.gmail,
        registerDate: new Date(u.fecha_registro).toLocaleDateString(),
        status: u.estado === "ACTIVO" ? "active" : "inactive",
      }));
      setUsers(formatted);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    }
  };

  const handleToggleEstado = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmToggleEstado = async () => {
    try {
      await cambiarEstadoUsuario(selectedUser.id);
      await fetchUsuarios();
      setShowModal(false);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="um-container">
      <div className="um-header">
        <h3 className="um-title">Gestión de Usuarios</h3>
        <div className="um-search-container">
          <input
            type="text"
            className="um-search-input"
            placeholder="Buscar usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <table className="um-table">
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
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.registerDate}</td>
              <td>
                <span
                  className={`um-status ${
                    user.status === "active" ? "um-status-active" : "um-status-inactive"
                  }`}
                >
                  {user.status === "active" ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td>
                <button
                  className={`um-action-btn ${
                    user.status === "active" ? "um-action-btn-danger" : "um-action-btn-success"
                  }`}
                  onClick={() => handleToggleEstado(user)}
                >
                  <i
                    className={`fas ${
                      user.status === "active" ? "fa-user-slash" : "fa-user-check"
                    }`}
                  ></i>{" "}
                  {user.status === "active" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmToggleEstado}
        title={
          selectedUser?.status === "active"
            ? "Confirmar Desactivación"
            : "Confirmar Activación"
        }
        icon={selectedUser?.status === "active" ? "user-slash" : "user-check"}
        message={
          selectedUser?.status === "active"
            ? "¿Estás seguro de que deseas desactivar esta cuenta? El usuario no podrá acceder al sistema hasta que sea reactivado."
            : "¿Estás seguro de que deseas activar esta cuenta? El usuario podrá volver a acceder al sistema."
        }
        confirmText={selectedUser?.status === "active" ? "Desactivar" : "Activar"}
      />
    </div>
  );
};

export default UserManagement;
