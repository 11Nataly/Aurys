// src/joven/components/MisMotivaciones/motivaciones/EditarMotivacion.jsx
import { useState, useEffect } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria";
import { editarMotivacion } from "../../../../services/motivacionService";
import "./AgregarMotivacion.css"; // Reutiliza los mismos estilos

const EditarMotivacion = ({ motivacion, onCerrar, onGuardar, categorias }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagenPreview, setImagenPreview] = useState(null);
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);

  // ✅ Cargar datos existentes
  useEffect(() => {
    if (motivacion) {
      setTitulo(motivacion.titulo || "");
      setDescripcion(motivacion.descripcion || "");
      setCategoria(motivacion.categoria_id?.toString() || "");
      setImagenPreview(motivacion.imagen || null);
    }
  }, [motivacion]);

  // ✅ Guardar cambios (sin imagen)
  const handleGuardar = async () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      const datosActualizados = {
        titulo,
        descripcion,
        categoria_id: parseInt(categoria),
      };

      const respuesta = await editarMotivacion(motivacion.id, datosActualizados);
      alert("Motivación actualizada correctamente.");
      onGuardar(respuesta);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar cambios. Intenta nuevamente.");
    }
  };

  // ✅ Drag & Drop (solo UI, no se envía)
  const handleImageDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagenPreview(previewUrl);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagenPreview(previewUrl);
    }
  };

  return (
    <div className="modal-fondo">
      <div className="modal-motivacion">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Editar motivación</h3>
          <button onClick={onCerrar} className="btn-cerrar">×</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
          {/* Imagen Drag & Drop */}
          <div
            className="dropzone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleImageDrop}
          >
            {imagenPreview ? (
              <img
                src={imagenPreview}
                alt="Vista previa"
                className="preview-imagen"
              />
            ) : (
              <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="input-imagen"
            />
          </div>

          {/* Campos */}
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
        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>Cancelar</button>
          <button className="btn-guardar" onClick={handleGuardar}>Guardar cambios</button>
        </div>

        {/* Modal Nueva Categoría */}
        {mostrarModalCategoria && (
          <NuevaCategoria
            onCerrar={() => setMostrarModalCategoria(false)}
            onGuardar={(nueva) => {
              categorias.push(nueva);
              setMostrarModalCategoria(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EditarMotivacion;
