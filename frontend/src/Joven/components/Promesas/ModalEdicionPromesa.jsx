// src/components/Promesas/ModalEdicionPromesa.jsx
import React, { useState, useEffect } from 'react';
import './ModalEdicionPromesa.css';

const ModalEdicionPromesa = ({ promesa, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    numMaximoRecaidas: 1,
  });

  const [errores, setErrores] = useState({});

  useEffect(() => {
    if (promesa) {
      setFormData({
        titulo: promesa.titulo || '',
        descripcion: promesa.descripcion || '',
        numMaximoRecaidas: promesa.num_maximo_recaidas || promesa.numMaximoRecaidas || 1,
      });
    }
  }, [promesa]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (formData.numMaximoRecaidas < 1)
      nuevosErrores.numMaximoRecaidas = 'Debe ser al menos 1';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      onGuardar({
        ...formData,
        num_maximo_recaidas: formData.numMaximoRecaidas,
      });
    }
  };

  const handleCancelar = () => {
    setFormData({
      titulo: promesa?.titulo || '',
      descripcion: promesa?.descripcion || '',
      numMaximoRecaidas: promesa?.num_maximo_recaidas || promesa?.numMaximoRecaidas || 1,
    });
    setErrores({});
    onCancelar();
  };

  return (
    <div className="modal-edicion-overlay">
      <div className="modal-edicion">
        <h2>Editar Promesa</h2>

        <form onSubmit={handleSubmit}>
          {/* --- TÍTULO --- */}
          <div className="form-group">
            <label htmlFor="tituloEdicion">Título *</label>
            <input
              type="text"
              id="tituloEdicion"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className={errores.titulo ? 'error' : ''}
              placeholder="Ej: No fumar cigarrillos"
            />
            {errores.titulo && <span className="error-message">{errores.titulo}</span>}
          </div>

          {/* --- DESCRIPCIÓN --- */}
          <div className="form-group">
            <label htmlFor="descripcionEdicion">Descripción</label>
            <textarea
              id="descripcionEdicion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Breve descripción..."
              rows="3"
            />
          </div>

          {/* --- NÚMERO MÁXIMO DE RECAÍDAS --- */}
          <div className="form-group">
            <label htmlFor="numMaximoRecaidasEdicion">Número máximo de recaídas *</label>
            <input
              type="number"
              id="numMaximoRecaidasEdicion"
              min="1"
              value={formData.numMaximoRecaidas}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  numMaximoRecaidas: parseInt(e.target.value) || 1,
                })
              }
              className={errores.numMaximoRecaidas ? 'error' : ''}
            />
            {errores.numMaximoRecaidas && (
              <span className="error-message">{errores.numMaximoRecaidas}</span>
            )}
          </div>

          {/* --- INFO ADICIONAL --- */}
          <div className="info-adicional">
            <h4>Información de la promesa:</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Estado:</span>
                <span className="info-value">{promesa?.estado}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Fecha creación:</span>
                <span className="info-value">
                  {promesa?.fecha_creacion
                    ? new Date(promesa.fecha_creacion).toLocaleDateString()
                    : '—'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Total fallos:</span>
                <span className="info-value">
                  {promesa?.progreso?.total_fallos || promesa?.progreso?.totalFallos || 0}
                </span>
              </div>
            </div>
          </div>

          {/* --- BOTONES --- */}
          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdicionPromesa;
