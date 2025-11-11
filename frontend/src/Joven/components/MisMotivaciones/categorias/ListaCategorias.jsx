import { useEffect, useState, useRef } from "react";
import CategoriaItem from "./CategoriaItem";
import NuevaCategoria from "./NuevaCategoria";
import EditarCategoria from "./EditarCategoria";
import "./categorias.css";

import {
  crearCategoria,
  listarCategorias,
  cambiarEstadoCategoria,
} from "../../../../services/categoriaService";

const ListaCategorias = ({ initialCategorias = [], onSelectCategoria, onCategoriasChange }) => {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [abierto, setAbierto] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef(null);

  // 🔹 Cargar categorías al montar
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

  // 🔹 Filtro de búsqueda
  useEffect(() => {
    if (!busqueda.trim()) {
      setSugerencias([]);
      setMostrarSugerencias(false);
      return;
    }

    const filtradas = categorias.filter((cat) =>
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    setSugerencias(filtradas.slice(0, 5));
    setMostrarSugerencias(true);
  }, [busqueda, categorias]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setMostrarSugerencias(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Crear categoría
  const agregarCategoria = async (categoriaData) => {
    try {
      const nuevaCategoria = await crearCategoria(categoriaData);

      if (
        categorias.some(
          (c) => c.nombre.toLowerCase() === nuevaCategoria.nombre.toLowerCase()
        )
      ) {
        alert("Ya existe una categoría con ese nombre");
        return;
      }

      setCategorias((prev) => [...prev, nuevaCategoria]);
      setMostrarModal(false);
      alert("Categoría creada exitosamente");

      // 🔹 Avisar al padre que hubo un cambio
      if (onCategoriasChange) onCategoriasChange();
    } catch (error) {
      console.error("Error al crear categoría:", error);
      alert("No se pudo crear la categoría");
    }
  };

  // 🔹 Eliminar categoría (cambio de estado)
  const handleEliminar = async (id) => {
    try {
      await cambiarEstadoCategoria(id, false);
      setCategorias((prev) => prev.filter((cat) => cat.id !== id));
      console.log("✅ Categoría eliminada visualmente y en backend");

      // 🔹 Avisar al padre que hubo un cambio
      if (onCategoriasChange) onCategoriasChange();
    } catch (err) {
      console.error("⚠️ Error al eliminar categoría:", err);
      alert(err.response?.data?.detail || "No se pudo eliminar la categoría.");
    }
  };

  const handleSeleccion = (id) => {
    setCategoriaSeleccionada(id);
    onSelectCategoria?.(id);
    setMostrarSugerencias(false);
  };

  const handleSeleccionSugerencia = (cat) => {
    setBusqueda(cat.nombre);
    handleSeleccion(cat.id);
  };

  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
  };

  const handleGuardarEdicion = (categoriaEditada) => {
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === categoriaEditada.id ? categoriaEditada : cat))
    );
    setCategoriaEditando(null);

    // 🔹 Avisar al padre que hubo un cambio
    if (onCategoriasChange) onCategoriasChange();
  };

  return (
    <div className="categorias-panel">
      <div className="categorias-header">
        <h3 onClick={() => setAbierto(!abierto)} style={{ cursor: "pointer" }}>
          Categorías
          <span className={`flecha ${abierto ? "arriba" : "abajo"}`}>▾</span>
        </h3>
        <button
          className="btn-agregar-categoria"
          onClick={() => setMostrarModal(true)}
        >
          +
        </button>
      </div>

      {abierto && (
        <>
          <div className="buscador-categorias" ref={inputRef}>
            <input
              type="text"
              placeholder="Buscar categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={() => busqueda && setMostrarSugerencias(true)}
              className="input-buscar-categoria"
            />

            {mostrarSugerencias && sugerencias.length > 0 && (
              <ul className="lista-sugerencias">
                {sugerencias.map((cat) => (
                  <li
                    key={cat.id}
                    className="item-sugerencia"
                    onClick={() => handleSeleccionSugerencia(cat)}
                  >
                    {cat.nombre}
                    {cat.esPredeterminada ? (
                      <span className="etiqueta predeterminada">Predeterminada</span>
                    ) : (
                      <span className="etiqueta personalizada">Personalizada</span>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {mostrarSugerencias && sugerencias.length === 0 && busqueda.length > 1 && (
              <div className="sin-resultados">No se encontraron categorías</div>
            )}
          </div>

          <ul className="lista-categorias">
            {categorias.map((cat) => (
              <CategoriaItem
                key={cat.id}
                categoria={cat}
                onEliminar={() => handleEliminar(cat.id)}
                onSeleccion={handleSeleccion}
                onEditar={handleEditar}
                activa={categoriaSeleccionada === cat.id}
              />
            ))}
          </ul>
        </>
      )}

      {mostrarModal && (
        <NuevaCategoria
          onCerrar={() => setMostrarModal(false)}
          onGuardar={agregarCategoria}
        />
      )}

      {categoriaEditando && (
        <EditarCategoria
          categoria={categoriaEditando}
          onCerrar={() => setCategoriaEditando(null)}
          onGuardar={handleGuardarEdicion}
        />
      )}
    </div>
  );
};

export default ListaCategorias;