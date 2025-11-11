import { useState, useEffect } from "react";
import NuevaCategoria from "../categorias/NuevaCategoria";
import {
  editarMotivacion,
  editarImagenMotivacion,
  favoritosMotivacion,
} from "../../../../services/motivacionService";
import { listarCategoriasActivas } from "../../../../services/categoriaService";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./AgregarMotivacion.css";

const EditarMotivacion = ({ motivacion, onCerrar, onGuardar }) => {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState(null); // File | string
  const [preview, setPreview] = useState("");
  const [mostrarModalCategoria, setMostrarModalCategoria] = useState(false);
  const [favorita, setFavorita] = useState(false);
  const [categorias, setCategorias] = useState([]);

  const cargarCategorias = async () => {
    try {
      const usuario_id = localStorage.getItem("id_usuario");
      const data = await listarCategoriasActivas(usuario_id);
      setCategorias(data);
    } catch (err) {
      console.error("Error al cargar categorías activas:", err);
      setCategorias([]);
    }
  };

  useEffect(() => {
    cargarCategorias();
    if (motivacion) {
      setTitulo(motivacion.titulo || "");
      setDescripcion(motivacion.descripcion || "");
      setCategoria(motivacion.categoria_id?.toString() || "");
      // si motivacion.imagen es url completa o filename
      if (motivacion.imagen) {
        // si ya es URL absoluta mantenla, si es solo filename construye URL
        const img = motivacion.imagen.startsWith("http")
          ? motivacion.imagen
          : `${import.meta.env.VITE_API_URL}/static/motivaciones/${motivacion.imagen}`;
        setPreview(img);
        setImagen(null); // por defecto no hay File nuevo
      } else {
        setPreview("");
        setImagen(null);
      }
      setFavorita(Boolean(motivacion.esFavorita));
    }
  }, [motivacion]);

  // Imagen: change or drop
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file));
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

  const handleGuardar = async () => {
    if (!titulo.trim() || !descripcion.trim() || !categoria.trim()) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    try {
      const usuario_id = parseInt(localStorage.getItem("id_usuario"));
      // payload básico (texto)
      const datosActualizados = {
        titulo,
        descripcion,
        categoria_id: parseInt(categoria),
        usuario_id,
      };

      // 1) editar texto/categoría (backend debe devolver la motivación actualizada o al menos el id)
      const respuesta = await editarMotivacion(motivacion.id, datosActualizados);

      // 2) si se seleccionó un File nuevo, subir imagen al endpoint dedicado
      let imagenActualizada = null;
      if (imagen && imagen instanceof File) {
        try {
          const resImagen = await editarImagenMotivacion(motivacion.id, imagen);
          // esperamos que el backend responda con la motivación o al menos con el campo imagen
          imagenActualizada = resImagen?.imagen || resImagen?.data?.imagen || null;
        } catch (errImg) {
          console.error("Error subiendo imagen:", errImg);
          alert("No se pudo subir la imagen. Los cambios de texto se guardaron igual.");
        }
      }

      // 3) actualizar favorita si cambió
      await favoritosMotivacion(motivacion.id, favorita);

      // 4) preparar objeto final a devolver al padre
      const resultadoFinal = {
        ...(respuesta || {}),
        esFavorita: favorita,
      };

      // Si el backend devolvió la imagen actualizada, construir URL completa si viene filename
      if (imagenActualizada) {
        resultadoFinal.imagen = imagenActualizada.startsWith("http")
          ? imagenActualizada
          : `${import.meta.env.VITE_API_URL}/static/motivaciones/${imagenActualizada}`;
      } else if (preview && imagen instanceof File) {
        // si no hay respuesta del backend, podemos usar preview local (temporal)
        resultadoFinal.imagen = preview;
      } else if (respuesta?.imagen) {
        resultadoFinal.imagen = respuesta.imagen.startsWith("http")
          ? respuesta.imagen
          : `${import.meta.env.VITE_API_URL}/static/motivaciones/${respuesta.imagen}`;
      }

      // 5) notificar al padre para que actualice la lista en pantalla
      onGuardar(resultadoFinal);
      onCerrar();
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar cambios. Intenta nuevamente.");
    }
  };

  const handleAgregarCategoria = async (nuevaCategoria) => {
    await cargarCategorias();
    setMostrarModalCategoria(false);
  };

  return (
    <div className="modal-fondo">
      <div className="modal-motivacion">
        <div className="modal-header">
          <h3>Editar motivación</h3>
          <button onClick={onCerrar} className="btn-cerrar">✕</button>
        </div>

        <div className="modal-body" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
          <div className="campos-superiores">
            <input type="text" placeholder="Editar título..." value={titulo} onChange={(e) => setTitulo(e.target.value)} />

            <textarea placeholder="Editar descripción..." value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows="3"></textarea>

            <div className="fila-categoria">
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                <option value="">Selecciona categoría</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>

              <button className="btn-agregar-categoria" onClick={() => setMostrarModalCategoria(true)}>+ Nueva categoría</button>
            </div>

            <div className="contenedor-imagen">
              <input type="file" id="input-imagen" accept="image/*" onChange={handleImagenChange} />
              <label htmlFor="input-imagen">Arrastra una imagen o haz clic para subir</label>

              {preview && (
                <div className="vista-previa-imagen">
                  <img src={preview} alt="Vista previa" />
                </div>
              )}
            </div>

            <div className="favorita-toggle" onClick={() => setFavorita(!favorita)} style={{ cursor: "pointer", marginTop: "10px" }}>
              {favorita ? <FaHeart color="red" size={22} /> : <FaRegHeart size={22} />}
              <span style={{ marginLeft: "8px" }}>{favorita ? "Marcar como no favorita" : "Marcar como favorita"}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancelar" onClick={onCerrar}>Cancelar</button>
          <button className="btn-guardar" onClick={handleGuardar}>Guardar cambios</button>
        </div>

        {mostrarModalCategoria && <NuevaCategoria onCerrar={() => setMostrarModalCategoria(false)} onGuardar={handleAgregarCategoria} />}
      </div>
    </div>
  );
};

export default EditarMotivacion;