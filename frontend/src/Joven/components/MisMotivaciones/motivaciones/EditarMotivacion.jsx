import { useState, useEffect } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria";
import "./AgregarMotivacion.css"; // Reutiliza los mismos estilos

const EditarMotivacion = ({ motivacion, onCerrar, onGuardar }) => {
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

  // ✅ Al montar el componente, carga los datos de la motivación actual
  useEffect(() => {
    if (motivacion) {
      setTitulo(motivacion.titulo || "");
      setDescripcion(motivacion.descripcion || "");
      setCategoria(motivacion.categoria_id?.toString() || "");
      setEsFavorita(motivacion.esFavorita === 1);
      setImagen(motivacion.imagen || "");
    }
  }, [motivacion]);

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

  // 💾 Guardar cambios (actualiza motivación existente)
  const handleGuardar = () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    const usuario_id = localStorage.getItem("id_usuario") || 1;
    const motivacionActualizada = {
      ...motivacion,
      usuario_id: parseInt(usuario_id),
      categoria_id: parseInt(categoria),
      titulo,
      descripcion,
      imagen:
        imagen ||
        "https://picsum.photos/seed/" + titulo.toLowerCase() + "/600/300",
      esFavorita: esFavorita ? 1 : 0,
      update_at: new Date().toISOString(),
    };

    onGuardar(motivacionActualizada);
  };

  const handleAgregarCategoria = (nuevaCategoria) => {
    setCategorias([...categorias, nuevaCategoria]);
    setMostrarModalCategoria(false);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-motivacion">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Editar motivación</h3>
          <button onClick={onCerrar} className="btn-cerrar">
            ×
          </button>
        </div>

        {/* BODY */}
        <div
          className="modal-body"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <div className="campos-superiores">
            <input
              type="text"
              placeholder="Editar título..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
              placeholder="Editar descripción..."
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

              <button
                className="btn-agregar-categoria"
                onClick={() => setMostrarModalCategoria(true)}
              >
                + Nueva categoría
              </button>
            </div>
          </div>

          {/* Imagen */}
          <div className="contenedor-imagen">
            <input
              type="file"
              id="input-imagen"
              accept="image/*"
              onChange={handleImagenChange}
            />
            <label htmlFor="input-imagen">
              Arrastra una imagen o haz clic para cambiar
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
            Guardar cambios
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

export default EditarMotivacion;
