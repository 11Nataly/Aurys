import { useEffect, useState, useRef } from "react";
import CategoriaItem from "./CategoriaItem";
import NuevaCategoria from "./NuevaCategoria";
import EditarCategoria from "./EditarCategoria";
import { PencilSquareIcon } from "@heroicons/react/24/outline"; // ✅ nuevo componente
import "./categorias.css";

const ListaCategorias = ({ initialCategorias = [], onSelectCategoria }) => {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false); // ✅
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [categoriaEditando, setCategoriaEditando] = useState(null); // ✅
  const [abierto, setAbierto] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
  const inputRef = useRef(null);

  // 🔹 Cargar categorías desde JSON si no hay iniciales
  useEffect(() => {
    if (initialCategorias.length === 0) {
      const cargarDatos = async () => {
        try {
          const response = await fetch("/Joven/fake_data/categorias.json");
          const data = await response.json();
          setCategorias(data.filter((cat) => cat.activo === 1));
        } catch (error) {
          console.error("Error cargando categorías:", error);
        }
      };
      cargarDatos();
    }
  }, [initialCategorias]);

  // 🔹 Actualizar sugerencias cuando cambia la búsqueda
  useEffect(() => {
    if (busqueda.trim().length === 0) {
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

  // 🔹 Acciones
  const agregarCategoria = (nuevaCategoria) => {
    setCategorias([...categorias, nuevaCategoria]);
    setMostrarModal(false);
  };

  const eliminarCategoria = (id) => {
    setCategorias(categorias.filter((c) => c.id !== id));
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

  // ✅ Nueva función: abrir modal de edición
  const handleEditar = (categoria) => {
    setCategoriaEditando(categoria);
  };

  // ✅ Actualizar categoría editada
  const handleGuardarEdicion = (categoriaEditada) => {
    setCategorias((prev) =>
      prev.map((cat) => (cat.id === categoriaEditada.id ? categoriaEditada : cat))
    );
    setMostrarEditar(false);
    setCategoriaEditando(null);
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
          {/* 🔹 Buscador */}
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

          {/* 🔹 Lista de categorías con botón editar */}
          <ul className="lista-categorias">
            {categorias.map((cat) => (
              <CategoriaItem
                key={cat.id}
                categoria={cat}
                onEliminar={eliminarCategoria}
                onSeleccion={handleSeleccion}
                onEditar={handleEditar}
                activa={categoriaSeleccionada === cat.id}
              />
            ))}
          </ul>
        </>
      )}

      {/* Modales */}
      {mostrarModal && (
        <NuevaCategoria
          onCerrar={() => setMostrarModal(false)}
          onGuardar={agregarCategoria}
        />
      )}

      {/* ✅ Modal de editar categoría */}
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
