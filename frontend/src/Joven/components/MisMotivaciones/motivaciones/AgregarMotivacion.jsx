//Frontend/src/Joven/components/MisMotivaciones/motivaciones/AgregarMotivacion.jsx
import { useState } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria"; // ✅ Importa el mismo modal que ya usas
import "./AgregarMotivacion.css";

const AgregarMotivacion = ({ onCerrar, onGuardar }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [esFavorita, setEsFavorita] = useState(false);
  const [imagen, setImagen] = useState("");
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Bienestar" },
    { id: 2, nombre: "Familia" },
    { id: 3, nombre: "Aprendizaje" },
    { id: 4, nombre: "Aventura" },
    { id: 5, nombre: "Contribución" },
  ]);

  // 📦 Drag & Drop imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagen(ev.target.result);
      reader.readAsDataURL(file);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagen(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleGuardar = () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      alert("Completa todos los campos.");
      return;
    }

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

  // ✅ Integración de agregar categoría (mismo flujo que ListaCategorias)
  const handleAgregarCategoria = (nuevaCategoria) => {
    setCategorias([...categorias, nuevaCategoria]);
    setMostrarModalCategoria(false);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-motivacion">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Nueva motivación</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="modal-body" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <div className="campos-superiores">
            <input
              type="text"
              placeholder="Escribe un título..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
              placeholder="Breve descripción (máx. 2–3 líneas)..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
            ></textarea>

            <div className="fila-categoria">
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Selecciona categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                ))}
              </select>

              {/* ✅ Botón reutilizado de ListaCategorias */}
              <button
                className="btn-agregar-categoria"
                onClick={() => setMostrarModalCategoria(true)}
              >
                + Nueva categoría
              </button>
            </div>

          </div>

          {/* 📸 Imagen (subir o arrastrar) */}
          <div className="contenedor-imagen">
            <input
              type="file"
              id="input-imagen"
              accept="image/*"
              onChange={handleImagenChange}
            />
            <label htmlFor="input-imagen">
              Arrastra una imagen o haz clic para subir
            </label>

            {imagen && (
              <div className="vista-previa-imagen">
                <img src={imagen} alt="Vista previa" />
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
          <button className="btn-guardar" onClick={handleGuardar}>
            Crear motivación
          </button>
        </div>

        {/* ✅ Modal de nueva categoría */}
        {mostrarModalCategoria && (
          <NuevaCategoria
            onCerrar={() => setMostrarModalCategoria(false)}
            onGuardar={handleAgregarCategoria}
          />
        )}
      </div>
    </div>
  );
};

export default AgregarMotivacion;
