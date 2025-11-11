// src/Admin/components/UserManagement.jsx
import React, { useState, useEffect } from "react";
import { listarUsuarios, cambiarEstadoUsuario } from "../../services/usuariosService";
import ConfirmModal from "./ConfirmModal";
import Pagination from "../../Joven/components/Pagination/Pagination"; // ✅ LÍNEA 5: Importar componente de paginación
import "./UserManagement.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ LÍNEA 13-14: Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 usuarios por página

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

  // ✅ LÍNEA 47-51: Filtrar usuarios primero por búsqueda
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ LÍNEA 54-57: Calcular usuarios paginados después del filtro
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  // ✅ LÍNEA 60-64: Manejador de cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ LÍNEA 67-70: Resetear paginación al buscar
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

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

      {/* ✅ LÍNEA 84: Mostrar información de paginación en la tabla */}
      <div className="um-table-info">
        Mostrando {paginatedUsers.length} de {filteredUsers.length} usuarios
        {filteredUsers.length > itemsPerPage && (
          <span className="um-page-info"> - Página {currentPage} de {Math.ceil(filteredUsers.length / itemsPerPage)}</span>
        )}
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
          {/* ✅ LÍNEA 100: Usar usuarios paginados en lugar de todos los filtrados */}
          {paginatedUsers.map((user) => (
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

      {/* ✅ LÍNEA 135-148: Componente de paginación */}
      {filteredUsers.length > itemsPerPage && (
        <div className="um-pagination-container">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsers.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            className="um-pagination"
            showTotal={false} // Ya mostramos la info arriba
            showPageNumbers={true}
            showNavigation={true}
          />
        </div>
      )}

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