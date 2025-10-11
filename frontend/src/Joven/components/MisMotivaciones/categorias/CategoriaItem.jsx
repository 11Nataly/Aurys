const CategoriaItem = ({ categoria, onEliminar, onSeleccion, activa }) => {
  return (
    <li
      className={`categoria-item ${activa ? "activa" : ""}`}
      onClick={() => onSeleccion(categoria.id)}
    >
      <span className="categoria-nombre">{categoria.nombre}</span>
      <span className="categoria-contador">
        {Math.floor(Math.random() * 10) + 1}
      </span>
      <button
        className="btn-eliminar"
        title="Eliminar categoría"
        onClick={(e) => {
          e.stopPropagation();
          onEliminar(categoria.id);
        }}
      >
        ×
      </button>
    </li>
  );
};

export default CategoriaItem;
