// src/components/Promesas/ModalRegistroFallos.jsx
import React, { useState } from "react";
import "./ModalRegistroFallos.css";
import { registrarFallo } from "../../../services/fallosService";

const ModalRegistroFallos = ({ promesa, onConfirmar, onCancelar }) => {
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  // CORREGIDO: Acepta "activo" o "en progreso"
  const estaEnPeriodoActivo = () => {
    const estado = promesa.estado?.toLowerCase();
    if (!estado || !["activo", "en progreso"].includes(estado)) return false;

    const hoy = new Date();
    const fechaInicio = new Date(promesa.fecha_creacion || promesa.fechaCreacion);
    const fechaFinal = promesa.fecha_finalizacion || promesa.fechaFinalizacion;

    if (!fechaInicio) return false;
    if (hoy < fechaInicio) return false;
    if (fechaFinal && hoy > new Date(fechaFinal)) return false;

    return true;
  };

  const puedeRegistrarFallo = estaEnPeriodoActivo();

  const handleConfirmar = async () => {
    if (!puedeRegistrarFallo) return;
    if (!descripcion.trim()) {
      alert("Por favor, describe brevemente el fallo.");
      return;
    }

    setLoading(true);
    try {
      const falloData = {
        promesa_id: promesa.id,
        descripcion: descripcion.trim(),
      };

      const response = await registrarFallo(falloData);

      if (onConfirmar && response) {
        onConfirmar(response);
      }

      alert("Fallo registrado correctamente");
      setDescripcion("");
    } catch (error) {
      console.error("Error al registrar el fallo:", error);
      alert("No se pudo registrar el fallo. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-registro-overlay">
      <div className="modal-registro">
        <h2>Registrar Fallo</h2>

        <div className="modal-content">
          <div className="promesa-info">
            <h3>{promesa.titulo}</h3>
            <p>Frecuencia: <strong>{promesa.frecuencia}</strong></p>
            <p>Fallos permitidos: <strong>{promesa.num_maximo_recaidas ?? "—"}</strong></p>
          </div>

          <div className={`estado-alerta ${!puedeRegistrarFallo ? "inactiva" : ""}`}>
            {!puedeRegistrarFallo ? (
              <p>Esta promesa no está activa. No puedes registrar fallos.</p>
            ) : (
              <p>Puedes registrar un nuevo fallo.</p>
            )}
          </div>

          {puedeRegistrarFallo && (
            <div className="control-descripcion">
              <label>Descripción del fallo:</label>
              <textarea
                placeholder="Describe qué ocurrió..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={loading}
                rows="3"
              />
            </div>
          )}

          <div className="detalle-registro">
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString("es-CO")}</p>
            <p><strong>Hora:</strong> {new Date().toLocaleTimeString("es-CO")}</p>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancelar}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className={`btn ${puedeRegistrarFallo ? "btn-primary" : "btn-disabled"}`}
            onClick={handleConfirmar}
            disabled={!puedeRegistrarFallo || loading || !descripcion.trim()}
          >
            {loading ? "Registrando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistroFallos;