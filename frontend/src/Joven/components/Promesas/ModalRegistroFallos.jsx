import React, { useState } from 'react';
import './ModalRegistroFallos.css';
import { registrarFallo } from '../../../services/fallosService'; // ✅ Importa el servicio backend

const ModalRegistroFallos = ({ promesa, onConfirmar, onCancelar }) => {
  const [cantidad, setCantidad] = useState(1);
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);

  // 🧠 Verificar si la promesa está en período activo
  const estaEnPeriodoActivo = () => {
    if (promesa.estado !== 'activo') return false;

    const hoy = new Date();
    const fechaFinal = new Date(promesa.fechaFinalizacion);
    const fechaInicio = new Date(promesa.fechaCreacion);

    return hoy >= fechaInicio && hoy <= fechaFinal;
  };

  const puedeRegistrarFallo = estaEnPeriodoActivo();

  // 🧩 Lógica de registro (con backend)
  const handleConfirmar = async () => {
    if (!puedeRegistrarFallo) return;

    if (!descripcion.trim()) {
      alert('Por favor, describe brevemente el fallo.');
      return;
    }

    setLoading(true);
    try {
      // 🔹 Llamada al backend
      await registrarFallo({
        promesa_id: promesa.id,
        descripcion: descripcion.trim(),
      });

      alert('✅ Fallo registrado con éxito');
      if (onConfirmar) onConfirmar(); // Refrescar lista
    } catch (error) {
      console.error('Error al registrar el fallo:', error);
      alert('❌ No se pudo registrar el fallo.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerMensajeEstado = () => {
    if (!estaEnPeriodoActivo()) {
      return 'Esta promesa ha finalizado su período. No puedes registrar más fallos.';
    }

    if (promesa.frecuencia === 'diaria') {
      const fallosHoy = promesa.progreso.fallosHoy || 0;
      const restantes = promesa.fallosPermitidos - fallosHoy;

      if (restantes <= 0) {
        return 'Has alcanzado el límite de fallos permitidos para hoy.';
      }
      return `Puedes registrar hasta ${restantes} fallo(s) más hoy.`;
    }

    return '¿Estás seguro de que quieres registrar este fallo?';
  };

  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <h2>Registrar Fallo</h2>

        <div className="modal-content">
          <div className="promesa-info">
            <h3>{promesa.titulo}</h3>
            <p>
              Frecuencia: <strong>{promesa.frecuencia}</strong>
            </p>
            <p>
              Fallos permitidos: <strong>{promesa.fallosPermitidos}</strong>
            </p>
          </div>

          <div className={`estado-alerta ${!puedeRegistrarFallo ? "inactiva" : ""}`}>
            {!puedeRegistrarFallo ? (
              <p>Esta promesa no está activa. No puedes registrar fallos.</p>
            ) : (
              <p>Puedes registrar un nuevo fallo.</p>
            )}
          </div>

          {puedeRegistrarFallo && (
            <>
              <div className="control-cantidad">
                <label htmlFor="cantidadFallos">Cantidad de fallos:</label>
                <input
                  type="number"
                  id="cantidadFallos"
                  min="1"
                  max={promesa.fallosPermitidos - (promesa.progreso.fallosHoy || 0)}
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                  disabled={loading}
                />
              </div>

              <div className="control-descripcion">
                <label htmlFor="descripcionFallo">Descripción del fallo:</label>
                <textarea
                  id="descripcionFallo"
                  placeholder="Describe brevemente qué ocurrió..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  disabled={loading}
                ></textarea>
              </div>
            </>
          )}

          <div className="detalle-registro">
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString("es-CO")}</p>
            <p><strong>Hora:</strong> {new Date().toLocaleTimeString("es-CO")}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="button"
            className={`btn ${puedeRegistrarFallo ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handleConfirmar}
            disabled={!puedeRegistrarFallo || loading}
          >
            {loading ? 'Registrando...' : 'Confirmar Fallo'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistroFallos;
