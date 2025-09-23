//la parte de arriva del diario
const DiarioHeader = ({ vistaActual, onCambiarVista }) => {
  return (
    <div className="diario-header">
      <div className="diario-titulo">
        <h1>Diario</h1>
        <p>Describe lo que viviste y sentiste hoy</p>
      </div>
      <div className="diario-botones-header">
        <button 
          className="btn-agregar" 
          onClick={() => onCambiarVista('agregar')}
          disabled={vistaActual === 'agregar'}
        >
          Agregar entrada
        </button>
        <button 
          className={`btn-historial ${vistaActual === 'historial' ? 'activo' : ''}`}
          onClick={() => onCambiarVista(vistaActual === 'historial' ? 'editor' : 'historial')}
        >
          {vistaActual === 'historial' ? 'Volver al Editor' : 'Historial de entradas'}
        </button>
      </div>
    </div>
  );
};

export default DiarioHeader;