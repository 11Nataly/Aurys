import { useState } from "react";
import "./motivaciones.css";

const AgregarMotivacion = ({ onCerrar, onGuardar }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [esFavorita, setEsFavorita] = useState(false);
  const [imagen, setImagen] = useState("");

  const handleGuardar = () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim())
      return alert("Completa todos los campos.");

    const usuario_id = localStorage.getItem("id_usuario") || 1;
    const nuevaMotivacion = {
      id: Date.now(),
      usuario_id: parseInt(usuario_id),
      categoria_id: parseInt(categoria),
      titulo,
      descripcion,
      imagen:
        imagen ||
        "https://picsum.photos/seed/" + titulo.toLowerCase() + "/600/300",
      esFavorita: esFavorita ? 1 : 0,
      activo: 1,
      created_at: new Date().toISOString(),
      update_at: new Date().toISOString(),
    };

    onGuardar(nuevaMotivacion);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-motivacion">
        <div className="modal-header">
          <h3>Nueva motivación</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            ×
          </button>
        </div>

        <div className="modal-body">
          <input
            type="text"
            placeholder="Título..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <textarea
            placeholder="Descripción (máx. 2–3 líneas)..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows="3"
          ></textarea>

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Selecciona categoría</option>
            <option value="1">Bienestar</option>
            <option value="2">Familia</option>
            <option value="3">Aprendizaje</option>
            <option value="4">Aventura</option>
            <option value="5">Contribución</option>
          </select>

          <label className="favorita-check">
            <input
              type="checkbox"
              checked={esFavorita}
              onChange={(e) => setEsFavorita(e.target.checked)}
            />
            Marcar como favorita
          </label>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar}>
            Crear motivación
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgregarMotivacion;
