// frontend/src/Joven/pages/MisMotivaciones.jsx
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import "../components/MisMotivaciones/motivaciones/motivaciones.css";
import "../components/MisMotivaciones/categorias/categorias.css";
import "../../styles/MisMotivaciones.css";

import ListaCategorias from "../components/MisMotivaciones/categorias/ListaCategorias";
import ListaMotivaciones from "../components/MisMotivaciones/motivaciones/ListaMotivaciones";
import EditarMotivacion from "../components/MisMotivaciones/motivaciones/EditarMotivacion";
import AgregarMotivacion from "../components/MisMotivaciones/motivaciones/AgregarMotivacion";

// Datos falsos locales
import motivacionesData from "../fake_data/motivaciones.json";
import categoriasData from "../fake_data/categorias.json";

const MisMotivaciones = () => {
  // Asegurar usuario en localStorage
  useEffect(() => {
    if (!localStorage.getItem("id_usuario")) {
      localStorage.setItem("id_usuario", "1");
    }
  }, []);

  // Estados principales
  const [categorias] = useState(categoriasData.filter((c) => c.activo === 1));
  const [motivaciones, setMotivaciones] = useState(
    motivacionesData.filter((m) => m.activo === 1)
  );

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [query, setQuery] = useState("");
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [motivacionEditando, setMotivacionEditando] = useState(null);

  // Handlers
  const handleAgregarMotivacion = (nueva) => {
    setMotivaciones((prev) => [nueva, ...prev]);
    setMostrarAgregar(false);
  };

  const handleEliminarMotivacion = (id) => {
    setMotivaciones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleFavorita = (id) => {
    setMotivaciones((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, esFavorita: m.esFavorita ? 0 : 1 } : m
      )
    );
  };

  const handleEditarMotivacion = (motivacion) => {
    setMotivacionEditando(motivacion);
  };

  const handleActualizarMotivacion = (motivacionEditada) => {
    setMotivaciones((prev) =>
      prev.map((m) => (m.id === motivacionEditada.id ? motivacionEditada : m))
    );
    setMotivacionEditando(null);
  };

  // Filtros memorizados
  const motivacionesFiltradas = useMemo(() => {
    let list = [...motivaciones];

    if (categoriaSeleccionada) {
      list = list.filter(
        (m) => Number(m.categoria_id) === Number(categoriaSeleccionada)
      );
    }
    if (soloFavoritas) {
      list = list.filter(
        (m) => Number(m.esFavorita) === 1 || m.esFavorita === true
      );
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          String(m.titulo).toLowerCase().includes(q) ||
          String(m.descripcion || "").toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  }, [motivaciones, categoriaSeleccionada, soloFavoritas, query]);

  // Render principal
  return (
    <div className="mm-page">
      <Breadcrumb />

      <div className="mm-container">
        <div className="mm-layout">
          {/* Sidebar de categorías */}
          <aside className="mm-sidebar">
            <ListaCategorias
              initialCategorias={categorias}
              onSelectCategoria={setCategoriaSeleccionada}
            />
          </aside>

          {/* Contenido principal */}
          <main className="mm-main">
            {/* Toolbar */}
            {/* Toolbar */}
            <div className="mm-toolbar">
              <div className="mm-toolbar-left">
                {categoriaSeleccionada ? (
                  <div className="mm-filtro-activo">
                    Filtrando por:{" "}
                    <strong>
                      {
                        categorias.find(
                          (c) => c.id === Number(categoriaSeleccionada)
                        )?.nombre
                      }
                    </strong>
                    {/* 🔹 Botón para limpiar el filtro */}
                    <button
                      className="btn-limpiar-filtro"
                      onClick={() => setCategoriaSeleccionada(null)}
                      title="Mostrar todas las categorías"
                    >
                      Mostrar todas
                    </button>
                  </div>
                ) : (
                  "Todas las categorías"
                )}
              </div>

              <div className="mm-toolbar-right">
                <span className="mm-count">
                  {motivacionesFiltradas.length} motivaciones
                </span>
              </div>
            </div>

            {/* Lista de motivaciones */}
            <ListaMotivaciones
              initialMotivaciones={motivacionesFiltradas}
              onEliminar={handleEliminarMotivacion}
              onToggleFavorita={handleToggleFavorita}
              onEditar={handleEditarMotivacion}
              onRequestAgregar={() => setMostrarAgregar(true)}
              query={query}
              setQuery={setQuery}
            />
          </main>
        </div>
      </div>

      {/* Modal Agregar */}
      {mostrarAgregar && (
        <AgregarMotivacion
          onCerrar={() => setMostrarAgregar(false)}
          onGuardar={handleAgregarMotivacion}
        />
      )}

      {/* Modal Editar */}
      {motivacionEditando && (
        <EditarMotivacion
          motivacion={motivacionEditando}
          onCerrar={() => setMotivacionEditando(null)}
          onGuardar={handleActualizarMotivacion}
        />
      )}
    </div>
  );
};

export default MisMotivaciones;
