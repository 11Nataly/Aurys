//Frontend/src/Joven/components/MisMotivaciones/motivaciones/AgregarMotivacion.jsx
import { useState, useEffect } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria"; // ✅ Importa el mismo modal que ya usasimport { crearMotivacion } from "../../../../services/motivacionService";
import { listarCategorias } from "../../../../services/categoriaService"; // si ya tienes este servicio
import { crearMotivacion } from "../../../../services/motivacionService";
import "./AgregarMotivacion.css";

const AgregarMotivacion = ({ onCerrar, onGuardar }) => {
   // ==============================
  // Estados del formulario
  // ==============================
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState(null); // objeto File o base64 (para backend)
  const [preview, setPreview] = useState(""); // solo para mostrar en pantalla
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false)
  const [categorias, setCategorias] = useState([]); // ✅ debe ser un array y es la lista del backend
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(""); // id seleccionada

  // ==============================
  // Cargar categorías reales del backend
  // ==============================

 useEffect(() => {
  const usuario_id = parseInt(localStorage.getItem("id_usuario")) || 1;

  const cargarCategorias = async () => {
    try {
      const data = await listarCategorias(usuario_id);
      setCategorias(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  };

  cargarCategorias();
}, []);

    // ==============================
  // Imagen: drag & drop o input
  // ==============================
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file)); // para mostrar
    }
  };

  const handleDrop = (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  if (file) {
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  }
};

  // ==============================
  // Guardar motivación (BACKEND)
  // ==============================

  const handleGuardar = async() => {
    if (!titulo.trim() || !descripcion.trim() || !categoriaSeleccionada) {
      alert("Completa todos los campos.");
      return;
    }


    const nuevaMotivacion = {
      id_usuario: parseInt(localStorage.getItem("id_usuario")),
      titulo,
      descripcion,
      id_categoria: parseInt(categoriaSeleccionada), // 👈 importante si el backend espera un ID numérico
      imagen, // objeto File
    };

    try {
      const response = await crearMotivacion(nuevaMotivacion); // ✅ ENVÍA AL BACKEND
      onGuardar(response); // ✅ ACTUALIZA LA LISTA EN EL PADRE
      onCerrar(); // ✅ CIERRA EL MODAL
    } catch (err) {
      console.error("Error al agregar la motivación:", err);
      alert(err.message || "Error al agregar la motivación");
    }
  };

    // ==============================
  // Nueva categoría (modal interno)
  // ==============================

  // ✅ Integración de agregar categoría (mismo flujo que ListaCategorias)
  const handleAgregarCategoria = (nuevaCategoria) => {
    setCategorias([...categorias, nuevaCategoria]);
    setMostrarModalCategoria(false);
  };

  // ==============================
  // Render
  // ==============================
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
              name="titulo"
              placeholder="Escribe un título..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />

            <textarea
              placeholder="Breve descripción (máx. 2–3 líneas)..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              rows="3"
            ></textarea>

            <div className="fila-categoria">
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
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

          {/* 📸 Imagen (subir (imagen) o arrastrar (preview)) */}
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
            
            {preview && (
              <div className="vista-previa-imagen">
                <img src={preview} alt="Vista previa" />
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
