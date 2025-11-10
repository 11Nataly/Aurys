import React, { useState } from 'react';
import ModalRegistroFallos from './ModalRegistroFallos';
import ModalEdicionPromesa from './ModalEdicionPromesa';
import './TarjetaPromesa.css';

const TarjetaPromesa = ({ 
  promesa, 
  onRegistrarFallo, 
  onFinalizarPromesa,
  onReactivarPromesa,
  onEditarPromesa, 
  onEliminarPromesa,
  onSeleccionar,
  isSeleccionada,
  filtroEstado
}) => {
  const [mostrarModalFallo, setMostrarModalFallo] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);

  const obtenerResumenProgreso = () => {
    if (promesa.frecuencia === 'diaria') {
      return `${promesa.progreso.fallosHoy || 0}/${promesa.fallosPermitidos} fallos hoy`;
    } else if (promesa.frecuencia === 'semanal') {
      return `${promesa.progreso.fallosEstaSemana || 0}/${promesa.fallosPermitidos} fallos esta semana`;
    }
    return `${promesa.progreso.totalFallos || 0} fallos totales`;
  };

  const handleFinalizar = (e) => {
    e.stopPropagation();
    onFinalizarPromesa(promesa.id, promesa.titulo);
  };

  const handleReactivar = (e) => {
    e.stopPropagation();
    onReactivarPromesa(promesa.id, promesa.titulo);
  };

  return (
    <>
      <div 
        className={`tarjeta-promesa ${isSeleccionada ? 'seleccionada' : ''} ${promesa.estado === 'finalizada' ? 'finalizada' : ''}`}
        onClick={onSeleccionar}
      >
        <div className="tarjeta-header">
          <h3>{promesa.titulo}</h3>
          <div className="acciones-tarjeta">
            <button 
              className="btn-icon"
              onClick={(e) => {
                e.stopPropagation();
                setMostrarModalEdicion(true);
              }}
              title="Editar promesa"
            >
              ✏️
            </button>
            <button 
              className="btn-icon"
              onClick={(e) => {
                e.stopPropagation();
                onEliminarPromesa(promesa.id);
              }}
              title="Eliminar promesa"
            >
              🗑️
            </button>
          </div>
        </div>

        {promesa.descripcion && (
          <div className="tarjeta-descripcion">
            <p>{promesa.descripcion}</p>
          </div>
        )}

        <div className="tarjeta-info">
          <span className="frecuencia">{promesa.frecuencia}</span>
          <span className={`estado ${promesa.estado}`}>
            {promesa.estado === 'activo' ? 'En progreso' : 'Finalizada'}
          </span>
        </div>

        <div className="progreso">
          <p>{obtenerResumenProgreso()}</p>
        </div>

        <div className="tarjeta-actions">
          {promesa.estado === 'activo' ? (
            <>
              <button
                className="btn btn-registrar"
                onClick={(e) => {
                  e.stopPropagation();
                  setMostrarModalFallo(true);
                }}
                title="Registrar fallo"
              >
                Registrar Fallo
              </button>
              <button
                className="btn btn-finalizar"
                onClick={handleFinalizar}
                title="Finalizar promesa"
              >
                Finalizar
              </button>
            </>
          ) : (
            <button
              className="btn btn-reactivar"
              onClick={handleReactivar}
              title="Reactivar promesa"
            >
              Reactivar
            </button>
          )}
        </div>
      </div>

      {mostrarModalFallo && (
        <ModalRegistroFallos
          promesa={promesa}
          onConfirmar={() => {
            onRegistrarFallo(promesa.id);
            setMostrarModalFallo(false);
          }}
          onCancelar={() => setMostrarModalFallo(false)}
        />
      )}

      {mostrarModalEdicion && (
        <ModalEdicionPromesa
          promesa={promesa}
          onGuardar={(datosActualizados) => {
            onEditarPromesa(promesa.id, datosActualizados);
            setMostrarModalEdicion(false);
          }}
          onCancelar={() => setMostrarModalEdicion(false)}
        />
      )}
    </>
  );
};

export default TarjetaPromesa;