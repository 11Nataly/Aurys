import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import "../components/MisMotivaciones/motivaciones/motivaciones.css";
import "../components/MisMotivaciones/categorias/categorias.css";
import "../../styles/MisMotivaciones.css";

import ListaCategorias from "../components/MisMotivaciones/categorias/ListaCategorias";
import ListaMotivaciones from "../components/MisMotivaciones/motivaciones/ListaMotivaciones";
import EditarMotivacion from "../components/MisMotivaciones/motivaciones/EditarMotivacion";
import AgregarMotivacion from "../components/MisMotivaciones/motivaciones/AgregarMotivacion";

import motivacionesData from "../fake_data/motivaciones.json";
import categoriasData from "../fake_data/categorias.json";

const MisMotivaciones = () => {
  useEffect(() => {
    if (!localStorage.getItem("id_usuario")) {
      localStorage.setItem("id_usuario", "1");
    }
  }, []);

  const [categorias, setCategorias] = useState(
    categoriasData.filter((c) => c.activo === 1)
  );
  const [motivaciones, setMotivaciones] = useState(
    motivacionesData.filter((m) => m.activo === 1)
  );

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [query, setQuery] = useState("");
  const [mostrarAgregar, setMostrarAgregar] = useState(false);
  const [motivacionEditando, setMotivacionEditando] = useState(null);
  const [refrescarMotivaciones, setRefrescarMotivaciones] = useState(0); // 👈 nuevo

  // ✅ Este callback se ejecuta cuando ListaCategorias detecta un cambio (crear/eliminar)
  const handleCategoriasChange = () => {
    console.log("🔁 Categorías cambiaron, refrescando motivaciones...");
    setRefrescarMotivaciones((prev) => prev + 1);
  };

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

  return (
    <div className="mm-page">
      <Breadcrumb />

      <div className="mm-container">
        <div className="mm-layout">
          <aside className="mm-sidebar">
            <ListaCategorias
              initialCategorias={categorias}
              onSelectCategoria={setCategoriaSeleccionada}
              onCategoriasChange={handleCategoriasChange} // 👈 agregado
            />
          </aside>

          <main className="mm-main">
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

            {/* 👇 usamos la clave para forzar re-render al cambiar categorías */}
            <ListaMotivaciones
              key={refrescarMotivaciones}
              query={query}
              setQuery={setQuery}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default MisMotivaciones;
