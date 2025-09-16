import React, { useState, useEffect } from 'react';
import AddGuideModal from './AddGuideModal';
import ConfirmModal from './ConfirmModal';
import './GuideManagement.css';

const GuideManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [guides, setGuides] = useState([]);

  // Cargar datos iniciales desde localStorage o usar datos de ejemplo
  useEffect(() => {
    const savedGuides = localStorage.getItem('guides');
    if (savedGuides) {
      setGuides(JSON.parse(savedGuides));
    } else {
      // Datos de ejemplo iniciales
      const exampleGuides = [
        { 
          id: 1, 
          title: 'Manejo de la ansiedad', 
          description: 'Técnicas efectivas para controlar la ansiedad en situaciones de estrés', 
          instructions: 'Practica estos ejercicios diariamente durante 15 minutos. Encuentra un lugar tranquilo y concéntrate en tu respiración.',
          duration: '00:15:30',
          durationHours: 0,
          durationMinutes: 15,
          durationSeconds: 30
        },
        { 
          id: 2, 
          title: 'Técnicas de relajación', 
          description: 'Ejercicios de respiración y relajación muscular progresiva', 
          instructions: 'Realiza estos ejercicios antes de dormir para mejorar la calidad de tu sueño. Sigue las instrucciones paso a paso.',
          duration: '00:22:45',
          durationHours: 0,
          durationMinutes: 22,
          durationSeconds: 45
        },
        { 
          id: 3, 
          title: 'Superando el estrés laboral', 
          description: 'Estrategias para manejar la presión en el entorno de trabajo', 
          instructions: 'Aplica estas técnicas cuando te sientas abrumado en el trabajo. Tómate pausas cortas para practicarlas.',
          duration: '00:18:20',
          durationHours: 0,
          durationMinutes: 18,
          durationSeconds: 20
        },
      ];
      setGuides(exampleGuides);
      localStorage.setItem('guides', JSON.stringify(exampleGuides));
    }
  }, []);

  // Guardar guías en localStorage cuando cambien
  useEffect(() => {
    if (guides.length > 0) {
      localStorage.setItem('guides', JSON.stringify(guides));
    }
  }, [guides]);

  const handleDelete = (guide) => {
    setSelectedGuide(guide);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedGuide) {
      const updatedGuides = guides.filter(g => g.id !== selectedGuide.id);
      setGuides(updatedGuides);
      setShowDeleteModal(false);
      setSelectedGuide(null);
    }
  };

  const handleEdit = (guide) => {
    setSelectedGuide(guide);
    setShowEditModal(true);
  };

  const handleAddGuide = (newGuide) => {
    // Generar un ID único para la nueva guía
    const newId = guides.length > 0 ? Math.max(...guides.map(g => g.id)) + 1 : 1;
    const guideToAdd = {
      ...newGuide,
      id: newId,
      duration: `${String(newGuide.durationHours).padStart(2, '0')}:${String(newGuide.durationMinutes).padStart(2, '0')}:${String(newGuide.durationSeconds).padStart(2, '0')}`
    };
    
    setGuides([...guides, guideToAdd]);
    setShowAddModal(false);
  };

  const handleUpdateGuide = (updatedGuide) => {
    const updatedGuides = guides.map(guide => 
      guide.id === selectedGuide.id 
        ? {
            ...updatedGuide,
            id: selectedGuide.id,
            duration: `${String(updatedGuide.durationHours).padStart(2, '0')}:${String(updatedGuide.durationMinutes).padStart(2, '0')}:${String(updatedGuide.durationSeconds).padStart(2, '0')}`
          }
        : guide
    );
    
    setGuides(updatedGuides);
    setShowEditModal(false);
    setSelectedGuide(null);
  };

  const formatDuration = (duration) => {
    if (!duration) return '00:00:00';
    
    // Si ya está en formato HH:MM:SS, devolverlo tal cual
    if (typeof duration === 'string' && duration.includes(':')) {
      return duration;
    }
    
    // Si es un objeto con horas, minutos y segundos, formatearlo
    if (typeof duration === 'object') {
      const { durationHours = 0, durationMinutes = 0, durationSeconds = 0 } = duration;
      return `${String(durationHours).padStart(2, '0')}:${String(durationMinutes).padStart(2, '0')}:${String(durationSeconds).padStart(2, '0')}`;
    }
    
    return '00:00:00';
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
              <td>{formatDuration(guide)}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    className="btn btn-sm btn-warning"
                    onClick={() => handleEdit(guide)}
                  >
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

      {showAddModal && (
        <AddGuideModal 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddGuide}
          mode="add"
        />
      )}

      {showEditModal && selectedGuide && (
        <AddGuideModal 
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedGuide(null);
          }}
          onSave={handleUpdateGuide}
          guideData={selectedGuide}
          mode="edit"
        />
      )}

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        icon="exclamation-triangle"
        message={`¿Estás seguro de que deseas eliminar la guía "${selectedGuide?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
};

export default GuideManagement;