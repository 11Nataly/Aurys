// src/components/Promesas/FormularioPromesa.jsx
import React, { useState, useEffect } from 'react';
import { crearPromesa, editarPromesa } from '../../../services/promesaService';
import './FormularioPromesa.css';

const FormularioPromesa = ({ promesaEditar, onGuardar, onCancelar }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    frecuencia: '',
    num_maximo_recaidas: 10
  });
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (promesaEditar) {
      setFormData({
        titulo: promesaEditar.titulo || '',
        descripcion: promesaEditar.descripcion || '',
        frecuencia: promesaEditar.frecuencia || '',
        num_maximo_recaidas: promesaEditar.num_maximo_recaidas || 1
      });
    }
  }, [promesaEditar]);

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!formData.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (!formData.frecuencia) nuevosErrores.frecuencia = 'Selecciona una frecuencia';
    if (!formData.num_maximo_recaidas || formData.num_maximo_recaidas < 1)
      nuevosErrores.num_maximo_recaidas = 'Mínimo 1 fallo permitido';
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setCargando(true);

    // ✅ Obtener el ID del usuario logueado desde localStorage
    const usuarioId = localStorage.getItem("id_usuario");

    const data = {
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      frecuencia: formData.frecuencia,
      num_maximo_recaidas: parseInt(formData.num_maximo_recaidas),
      usuario_id: usuarioId ? parseInt(usuarioId) : null // ← toma el usuario real del login
    };

    try {
      let respuesta;
      if (promesaEditar) {
        respuesta = await editarPromesa(promesaEditar.id, data);
      } else {
        respuesta = await crearPromesa(data);
      }
      onGuardar(respuesta);
      onCancelar();
    } catch (error) {
      console.error("Error completo:", error);
      if (error.response) {
        const datos = error.response.data;
        const erroresBackend = {};
        Object.keys(datos).forEach(key => {
          erroresBackend[key] = Array.isArray(datos[key]) ? datos[key][0] : datos[key];
        });
        setErrores(erroresBackend);
        alert("Error del servidor: " + JSON.stringify(erroresBackend));
      } else if (error.request) {
        alert("No se pudo conectar al servidor. ¿Está corriendo en http://localhost:8000?");
      } else {
        alert("Error desconocido: " + error.message);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({ titulo: '', descripcion: '', frecuencia: '', num_maximo_recaidas: 10 });
    setErrores({});
    onCancelar();
  };

  return (
    <div className="formulario-promesa-overlay">
      <div className="formulario-promesa">
        <h2>{promesaEditar ? 'Editar Promesa' : 'Crear Nueva Promesa'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título *</label>
            <input
              type="text"
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
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
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Opcional..."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Frecuencia *</label>
            <div className="frecuencia-options">
              {['diaria', 'semanal', 'situacional'].map(f => (
                <label key={f} className="radio-label">
                  <input
                    type="radio"
                    value={f}
                    checked={formData.frecuencia === f}
                    onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
                  />
                  <span className="radio-custom"></span>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </label>
              ))}
            </div>
            {errores.frecuencia && <span className="error-message">{errores.frecuencia}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="fallos">Fallos permitidos *</label>
            <input
              type="number"
              id="fallos"
              min="1"
              value={formData.num_maximo_recaidas}
              onChange={(e) =>
                setFormData({ ...formData, num_maximo_recaidas: parseInt(e.target.value) || 1 })
              }
              className={errores.num_maximo_recaidas ? 'error' : ''}
            />
            {errores.num_maximo_recaidas && (
              <span className="error-message">{errores.num_maximo_recaidas}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancelar}
              disabled={cargando}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={cargando}>
              {cargando ? 'Guardando...' : promesaEditar ? 'Guardar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioPromesa;
