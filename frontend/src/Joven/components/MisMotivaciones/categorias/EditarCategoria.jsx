// frontend/src/Joven/components/MisMotivaciones/categorias/EditarCategoria.jsx
import { useState } from "react";
import "./categorias.css";


const EditarCategoria = ({ categoria, onCerrar, onGuardar }) => {
  const [nombre, setNombre] = useState(categoria?.nombre || "");

  const handleGuardar = () => {
    if (!nombre.trim()) {
      alert("El nombre de la categoría no puede estar vacío.");
      return;
    }

    // 🔹 Creamos una copia modificada para simular actualización
    const categoriaEditada = {
      ...categoria,
      nombre,
      update_at: new Date().toISOString(),
    };

    onGuardar(categoriaEditada);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-categoria">
        <div className="modal-header">
          <h3>Editar categoría</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">
          <label htmlFor="nombre">Nombre de la categoría</label>
          <input
            id="nombre"
            type="text"
            placeholder="Ej. 🌱 Crecimiento personal"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarCategoria;
