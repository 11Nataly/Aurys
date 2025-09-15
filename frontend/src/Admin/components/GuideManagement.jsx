import React, { useState } from 'react';
import AddGuideModal from './AddGuideModal';
import ConfirmModal from './ConfirmModal';
import './GuideManagement.css'; // Importar los estilos

const GuideManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);

  // Datos de ejemplo
  const guides = [
    { 
      id: 1, 
      title: 'Manejo de la ansiedad', 
      description: 'Técnicas efectivas para controlar la ansiedad en situaciones de estrés', 
      duration: '00:15:30'
    },
    { 
      id: 2, 
      title: 'Técnicas de relajación', 
      description: 'Ejercicios de respiración y relajación muscular progresiva', 
      duration: '00:22:45'
    },
    { 
      id: 3, 
      title: 'Superando el estrés laboral', 
      description: 'Estrategias para manejar la presión en el entorno de trabajo', 
      duration: '00:18:20'
    },
  ];

  const handleDelete = (guide) => {
    setSelectedGuide(guide);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    // Lógica para eliminar guía
    console.log('Eliminando guía:', selectedGuide);
    setShowDeleteModal(false);
  };

  return (
    <div className="guide-management-container">
      <div className="guide-header">
        <h3 className="guide-title">Guías de Afrontamiento</h3>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Agregar Guía
        </button>
      </div>

      <table className="guide-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Duración de video</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {guides.map(guide => (
            <tr key={guide.id}>
              <td>{guide.title}</td>
              <td>{guide.description}</td>
              <td>{guide.duration}</td>
              <td>
                <div className="action-buttons">
                  <button className="btn btn-sm btn-warning">
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(guide)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddGuideModal 
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        icon="exclamation-triangle"
        message="¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
      />
    </div>
  );
};

export default GuideManagement;