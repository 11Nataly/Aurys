// src/components/Promesas/FormularioPromesa.jsx
import React, { useState, useEffect } from 'react';
import { crearPromesa, editarPromesa } from '../../../services/promesaService';
import './FormularioPromesa.css';

const FormularioPromesa = ({ promesaEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    frecuencia: '',
    fallosPermitidos: 10
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  // 🔹 Si estamos editando, precargar los datos
  useEffect(() => {
    if (promesaEditar) {
      setFormData({
        titulo: promesaEditar.titulo || '',
        descripcion: promesaEditar.descripcion || '',
        frecuencia: promesaEditar.tipo_frecuencia || '',
        fallosPermitidos: promesaEditar.num_maximo_recaidas || 1
      });
    }
  }, [promesaEditar]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (!formData.frecuencia) nuevosErrores.frecuencia = 'Debe seleccionar una frecuencia';
    if (!formData.fallosPermitidos || formData.fallosPermitidos < 1)
      nuevosErrores.fallosPermitidos = 'Debe permitir al menos 1 fallo';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;
    setCargando(true);

    const data = {
      titulo: formData.titulo,
      descripcion: formData.descripcion,
      tipo_frecuencia: formData.frecuencia,
      num_maximo_recaidas: formData.fallosPermitidos,
      usuario_id: 1 // ⚠️ temporal, reemplázalo por el ID real del usuario logueado
    };

    try {
      let respuesta;
      if (promesaEditar) {
        // 🔹 Editar
        respuesta = await editarPromesa(promesaEditar.id, data);
        console.log("Promesa actualizada:", respuesta);
      } else {
        // 🔹 Crear
        respuesta = await crearPromesa(data);
        console.log("Promesa creada:", respuesta);
      }

      onGuardar(respuesta);
      onCancelar(); // cerrar el modal o formulario
    } catch (error) {
      console.error("Error al guardar la promesa:", error);
      alert("Ocurrió un error al guardar la promesa. Revisa la consola.");
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({ titulo: '', descripcion: '', frecuencia: '', fallosPermitidos: 10 });
    setErrores({});
    onCancelar();
  };

  return (
    <div className="formulario-promesa-overlay">
      <div className="formulario-promesa">
        <h2>{promesaEditar ? 'Editar Promesa' : 'Crear Nueva Promesa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título de la promesa *</label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({...formData, titulo: e.target.value})}
              className={errores.titulo ? 'error' : ''}
              placeholder="Ej: No fumar cigarrillos"
            />
            {errores.titulo && <span className="error-message">{errores.titulo}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
              placeholder="Breve descripción de tu promesa..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Frecuencia *</label>
            <div className="frecuencia-options">
              {['diaria', 'semanal', 'situacional'].map(frecuencia => (
                <label key={frecuencia} className="radio-label">
                  <input
                    type="radio"
                    value={frecuencia}
                    checked={formData.frecuencia === frecuencia}
                    onChange={(e) => setFormData({...formData, frecuencia: e.target.value})}
                  />
                  <span className="radio-custom"></span>
                  {frecuencia.charAt(0).toUpperCase() + frecuencia.slice(1)}
                </label>
              ))}
            </div>
            {errores.frecuencia && <span className="error-message">{errores.frecuencia}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fallosPermitidos">Fallos permitidos *</label>
            <input
              type="number"
              id="fallosPermitidos"
              min="1"
              value={formData.fallosPermitidos}
              onChange={(e) => setFormData({...formData, fallosPermitidos: parseInt(e.target.value)})}
              className={errores.fallosPermitidos ? 'error' : ''}
            />
            {errores.fallosPermitidos && <span className="error-message">{errores.fallosPermitidos}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancelar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : promesaEditar ? 'Guardar Cambios' : 'Guardar Promesa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPromesa;
