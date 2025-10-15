// frontend/ src/ Joven / components / MisMotivaciones / categorias / CategoriaItem.jsx
import { PencilSquareIcon } from "@heroicons/react/24/outline";
const CategoriaItem = ({ categoria, onEliminar, onSeleccion, onEditar, activa }) => {
  return (
    <li
      className={`categoria-item ${activa ? "activa" : ""}`}
      onClick={() => onSeleccion(categoria.id)}
    >
      {/* Nombre + contador */}
      <div className="categoria-info">
        <span className="categoria-nombre">{categoria.nombre}</span>
        <span className="categoria-contador">
          {Math.floor(Math.random() * 10) + 1}
        </span>
      </div>

      {/* Acciones */}
      <div className="categoria-acciones">
        <button
          className="btn-eliminar-categoria"
          title="Eliminar categoría"
          onClick={(e) => {
            e.stopPropagation();
            onEliminar(categoria.id);
          }}
        >
          ×
        </button>

        <button
          className="btn-editar-categoria"
          title="Editar categoría"
          onClick={(e) => {
            e.stopPropagation();
            onEditar?.(categoria); // 🔹 Llamamos a onEditar con la categoría completa
          }}
        >
          <PencilSquareIcon className="icono-editar" />
        </button>
      </div>
    </li>
  );
};

export default CategoriaItem;