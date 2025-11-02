import React, { useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import { editarPerfil } from "../../../services/perfilService";
import "./ProfileInfo.css";

Modal.setAppElement("#root");

const ProfileInfo = ({ userData, onUpdateUser }) => {
  const [tempData, setTempData] = useState({
    nombre: userData.nombre,
    correo: userData.correo,
  });
  const [isEditing, setIsEditing] = useState({ nombre: false, correo: false });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEditToggle = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
    setError("");
  };

  const handleSave = async (field) => {
    try {
      const updated = await editarPerfil(userData.id, {
        nombre: field === "nombre" ? tempData.nombre : userData.nombre,
        correo: field === "correo" ? tempData.correo : userData.correo,
        foto: null,
      });

      onUpdateUser(field, updated[field]);
      setSuccessMessage(`${field === "nombre" ? "Nombre" : "Correo"} actualizado correctamente`);
      setShowModal(true);
      handleEditToggle(field);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setError("Error al guardar los cambios");
    }
  };

  const renderField = (field, label) => (
    <div className="profile-field">
      <label className="field-label">{label}</label>
      <div className="field-input-container">
        {isEditing[field] ? (
          <>
            <input
              type="text"
              value={tempData[field]}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className="field-input"
            />
            <div className="field-actions">
              <button className="action-btn save" onClick={() => handleSave(field)}>
                <FaCheck />
              </button>
              <button className="action-btn cancel" onClick={() => handleEditToggle(field)}>
                <FaTimes />
              </button>
            </div>
          </>
        ) : (
          <>
            <span className="field-value">{userData[field]}</span>
            <button
              className="edit-btn"
              onClick={() => handleEditToggle(field)}
              aria-label={`Editar ${label}`}
            >
              <FaEdit />
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="profile-info">
      <h3 className="info-title">Información Personal</h3>
      {renderField("nombre", "Nombre")}
      {renderField("correo", "Correo Electrónico")}
      {error && <p className="field-error">{error}</p>}

      {/* Modal de confirmación */}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="custom-modal"
        overlayClassName="custom-modal-overlay"
      >
        <div className="modal-content">
          <div className="modal-icon success">✓</div>
          <h3 className="modal-title">¡Actualizado!</h3>
          <p className="modal-message">{successMessage}</p>
          <button className="modal-btn modal-btn-primary" onClick={() => setShowModal(false)}>
            Continuar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProfileInfo;
