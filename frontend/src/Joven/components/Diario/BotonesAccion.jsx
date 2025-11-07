// src/Joven/components/Diario/BotonesAccion.jsx
const BotonesAccion = ({ onCancelar, onGuardar, guardarHabilitado = true }) => {
  return (
    <div className="botones-accion">
      <button className="btn-cancelar" onClick={onCancelar}>
        Cancelar
      </button>
      <button 
        className="btn-guardar" 
        onClick={onGuardar}
        disabled={!guardarHabilitado}
      >
        Guardar
      </button>
    </div>
  );
};

export default BotonesAccion;