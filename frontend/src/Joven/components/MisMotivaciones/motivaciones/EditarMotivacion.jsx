import { useState, useEffect } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria";
import { editarMotivacion } from "../../../../services/motivacionService"; // ✅ importa aquí
import "./AgregarMotivacion.css"; // Reutiliza los mismos estilos

const EditarMotivacion = ({ motivacion, onCerrar, onGuardar }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Bienestar" },
    { id: 2, nombre: "Familia" },
    { id: 3, nombre: "Aprendizaje" },
    { id: 4, nombre: "Aventura" },
    { id: 5, nombre: "Contribución" },
  ]);

  // ✅ Cargar datos existentes
  useEffect(() => {
    if (motivacion) {
      setTitulo(motivacion.titulo || "");
      setDescripcion(motivacion.descripcion || "");
      setCategoria(motivacion.categoria_id?.toString() || "");
      setImagen(motivacion.imagen || "");

    }
  }, [motivacion]);

  // � Guardar cambios
  const handleGuardar = async () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      const usuario_id = localStorage.getItem("id_usuario");
      const datosActualizados = {
        titulo,
        descripcion,
        categoria_id: parseInt(categoria),
        usuario_id: parseInt(usuario_id),
      };

      const respuesta = await editarMotivacion(motivacion.id, datosActualizados);
      console.log("✅ Motivación actualizada:", respuesta);
      alert("Motivación actualizada correctamente.");
      onGuardar(respuesta);
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar cambios. Intenta nuevamente.");
    }
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
          <button onClick={onCerrar} className="btn-cerrar">×</button>
        </div>

        {/* BODY */}
        <div className="modal-body">
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
                  <option key={c.id} value={c.id}>{c.nombre}</option>
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
            onGuardar={handleAgregarCategoria}
          />
        )}
      </div>
    </div>
  );
};

export default EditarMotivacion;