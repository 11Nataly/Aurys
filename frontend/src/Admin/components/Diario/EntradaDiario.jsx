// src/components/Diario/EditorDiario.jsx
const EditorDiario = ({ entradas, onAgregarEntrada }) => {
  const ultimaEntrada = entradas[entradas.length - 1];

  if (!ultimaEntrada) {
    return (
      <div className="editor-diario-vacio">
        <div className="mensaje-bienvenida">
          <h2>Bienvenido a tu diario</h2>
          <p>Comienza escribiendo sobre tu día. Tus pensamientos y experiencias están esperando ser recordados.</p>
          <button className="btn-comenzar" onClick={onAgregarEntrada}>
            Comenzar a escribir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="entrada-diario-editor">
      <div className="editor-header">
        <div>
          <h2 className="entrada-titulo">{ultimaEntrada.titulo}</h2>
          <div className="editor-fecha">
            {ultimaEntrada.fecha}
          </div>
        </div>
        <div className="entrada-acciones">
          <button className="btn-editar" onClick={onAgregarEntrada} title="Editar entrada">
            ✏️
          </button>
        </div>
      </div>
      
      <div className="editor-contenido">
        <div className="entrada-texto">
          {ultimaEntrada.contenido}
        </div>
      </div>
    </div>
  );
};

export default EditorDiario;