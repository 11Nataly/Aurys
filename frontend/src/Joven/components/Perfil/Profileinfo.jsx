import React, { useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Modal from "react-modal";
import "./ProfileInfo.css";
import { actualizarPerfil } from "../../../services/perfilService";

Modal.setAppElement("#root");

const ProfileInfo = ({ userData, isEditing, onUpdateUser, onEditToggle }) => {
  const [tempValues, setTempValues] = useState({
    nombre: userData.nombre,
    correo: userData.correo,
    contrasena: "",
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (field, value) => {
    setTempValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateField = (field, value) => {
    let msg = "";
    
    if (field === "nombre") {
      if (!value || value.trim() === "") {
        msg = "El nombre es requerido";
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
        msg = "Solo se permiten letras y espacios";
      }
    }
    
    if (field === "correo") {
      if (!value || value.trim() === "") {
        msg = "El correo es requerido";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg = "Correo inválido";
      }
    }
    
    if (field === "contrasena" && value && value.length < 6) {
      msg = "Debe tener al menos 6 caracteres";
    }
    
    setErrors((prev) => ({ ...prev, [field]: msg }));
    return !msg;
  };

  const handleSave = async (field) => {
    const value = tempValues[field]?.trim();
    
    // Para contraseña, si está vacía, no enviar
    if (field === "contrasena" && (!value || value === "")) {
      setErrors((prev) => ({ ...prev, [field]: "La contraseña no puede estar vacía" }));
      return;
    }

    if (!validateField(field, value)) return;

    // Preparar datos para enviar
    const data = { [field]: value };

    try {
      console.log("📤 Enviando actualización:", data);
      const response = await actualizarPerfil(userData.id, data);
      console.log("✅ Respuesta backend:", response);

      // Actualizar solo si el campo no es contraseña (ya que el backend no la retorna)
      if (field !== "contrasena") {
        onUpdateUser(field, response[field] || value);
      }

      setSuccessMessage(
        field === "contrasena" 
          ? "Contraseña actualizada correctamente" 
          : `${field.charAt(0).toUpperCase() + field.slice(1)} actualizado correctamente`
      );
      setShowModal(true);
      
      // Limpiar contraseña después de guardar
      if (field === "contrasena") {
        setTempValues(prev => ({ ...prev, contrasena: "" }));
      }
      
      onEditToggle(field);
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      const errorDetail = error.response?.data?.detail;
      let errorMessage = "Error al guardar los cambios";
      
      if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail.map(err => err.msg).join(", ");
      } else if (typeof errorDetail === 'string') {
        errorMessage = errorDetail;
      }
      
      setErrors((prev) => ({ ...prev, [field]: errorMessage }));
    }
  };

  const handleCancel = (field) => {
    setTempValues((prev) => ({
      ...prev,
      [field]: field === "contrasena" ? "" : userData[field],
    }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    onEditToggle(field);
  };

  return (
    <div className="profile-info">
      <h3 className="info-title">Información Personal</h3>

      {["nombre", "correo", "contrasena"].map((field) => (
        <div key={field} className="profile-field">
          <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
          <div className="field-input-container">
            {isEditing[field] ? (
              <>
                <input
                  type={field === "contrasena" ? "password" : "text"}
                  value={tempValues[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  className={`field-input ${errors[field] ? "error" : ""}`}
                  placeholder={field === "contrasena" ? "Nueva contraseña..." : ""}
                />
                <div className="field-actions">
                  <button className="action-btn save" onClick={() => handleSave(field)}>
                    <FaCheck />
                  </button>
                  <button className="action-btn cancel" onClick={() => handleCancel(field)}>
                    <FaTimes />
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="field-value">
                  {field === "contrasena" ? "••••••••" : userData[field]}
                </span>
                <button className="edit-btn" onClick={() => onEditToggle(field)}>
                  <FaEdit />
                </button>
              </>
            )}
          </div>
          {errors[field] && <div className="field-error">{errors[field]}</div>}
        </div>
      ))}

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