import { useEffect, useState } from "react";
import CategoriaItem from "./CategoriaItem";
import NuevaCategoria from "./NuevaCategoria";
import "./categorias.css";

const ListaCategorias = ({ initialCategorias = [], onSelectCategoria }) => {
  const [categorias, setCategorias] = useState(initialCategorias);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  // 🔹 Si no hay categorías iniciales, carga desde JSON
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
  };

  return (
    <div className="categorias-panel">
      <div className="categorias-header">
        <h3>Categorías</h3>
        <button
          className="btn-agregar-categoria"
          onClick={() => setMostrarModal(true)}
        >
          +
        </button>
      </div>

      <ul className="lista-categorias">
        <li
          className={`categoria-item ${
            categoriaSeleccionada === null ? "activa" : ""
          }`}
          onClick={() => handleSeleccion(null)}
        >
          <span className="categoria-nombre">Todas</span>
          <span className="categoria-contador">
            {categorias.length > 0 ? categorias.length : 0}
          </span>
        </li>

        {categorias.map((cat) => (
          <CategoriaItem
            key={cat.id}
            categoria={cat}
            onEliminar={eliminarCategoria}
            onSeleccion={handleSeleccion}
            activa={categoriaSeleccionada === cat.id}
          />
        ))}
      </ul>

      {mostrarModal && (
        <NuevaCategoria
          onCerrar={() => setMostrarModal(false)}
          onGuardar={agregarCategoria}
        />
      )}
    </div>
  );
};

export default ListaCategorias;
