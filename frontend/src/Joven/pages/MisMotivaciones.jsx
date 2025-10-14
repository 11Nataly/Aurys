import React, { useEffect, useMemo, useState } from "react";
import "../components/MisMotivaciones/motivaciones/motivaciones.css"; // si usas el css global que te entregué
import "../components/MisMotivaciones/categorias/categorias.css";     // estilos de categorias (opcional)
import "../../styles/MisMotivaciones.css"; // estilos específicos de la página (opcional)

import ListaCategorias from "../components/MisMotivaciones/categorias/ListaCategorias";
import ListaMotivaciones from "../components/MisMotivaciones/motivaciones/ListaMotivaciones";

// Importar datos falsos (webpack/CRA supports importing JSON from src)
import motivacionesData from "../fake_data/motivaciones.json";
import categoriasData from "../fake_data/categorias.json";

const MisMotivaciones = () => {
  // asegurar usuario en localStorage para los servicios/componenetes
  useEffect(() => {
    if (!localStorage.getItem("id_usuario")) {
      localStorage.setItem("id_usuario", "1");
    }
  }, []);

  // estados de la página
  const [categorias] = useState(categoriasData.filter((c) => c.activo === 1));
  const [motivaciones, setMotivaciones] = useState(
    motivacionesData.filter((m) => m.activo === 1)
  );

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [soloFavoritas, setSoloFavoritas] = useState(false);
  const [query, setQuery] = useState("");
  const [mostrarAgregar, setMostrarAgregar] = useState(false);

  // handlers que pasarán a componentes hijos (puedes adaptarlos si tus componentes ya exponen callbacks)
  const handleAgregarMotivacion = (nueva) => {
    setMotivaciones((prev) => [nueva, ...prev]);
    setMostrarAgregar(false);
  };

  const handleEliminarMotivacion = (id) => {
    setMotivaciones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleFavorita = (id) => {
    setMotivaciones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, esFavorita: m.esFavorita ? 0 : 1 } : m))
    );
  };

  const handleEditarMotivacion = (obj) => {
    setMotivaciones((prev) => prev.map((m) => (m.id === obj.id ? obj : m)));
  };

  // filtrado aplicado a la lista (memorizado)
  const motivacionesFiltradas = useMemo(() => {
    let list = [...motivaciones];

    if (categoriaSeleccionada) {
      list = list.filter((m) => Number(m.categoria_id) === Number(categoriaSeleccionada));
    }
    if (soloFavoritas) {
      list = list.filter((m) => Number(m.esFavorita) === 1 || m.esFavorita === true);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          String(m.titulo).toLowerCase().includes(q) ||
          String(m.descripcion || "").toLowerCase().includes(q)
      );
    }

    // ordenar por created_at desc
    list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return list;
  }, [motivaciones, categoriaSeleccionada, soloFavoritas, query]);

  return (
    <div className="mm-page">
      <div className="mm-container">
        <div className="mm-layout">
          {/* Sidebar categorias */}
          <aside className="mm-sidebar">
            {/* Pasamos categorias como prop para que el componente use los datos falsos */}
            <ListaCategorias initialCategorias={categorias} onSelectCategoria={setCategoriaSeleccionada} />
          </aside>

          {/* Main content */}
          <main className="mm-main">
            {/* Toolbar secundaria (opcional: ordenar, filtros) */}
            <div className="mm-toolbar">
              <div className="mm-toolbar-left">
                {categoriaSeleccionada
                  ? `Filtrando por: ${categorias.find(c => c.id === Number(categoriaSeleccionada))?.nombre || ""}`
                  : "Todas las categorías"}
              </div>
              <div className="mm-toolbar-right">
                <span className="mm-count">{motivacionesFiltradas.length} motivaciones</span>
              </div>
            </div>

            {/* Lista de tarjetas */}
            <ListaMotivaciones
              initialMotivaciones={motivacionesFiltradas}
              onEliminar={handleEliminarMotivacion}
              onToggleFavorita={handleToggleFavorita}
              onEditar={handleEditarMotivacion}
              onRequestAgregar={() => setMostrarAgregar(true)}
            />

            {/* Modal de agregar/editar: si tu componente AgregarMotivacion es independiente lo puedes invocar aquí */}
            {mostrarAgregar && (
              <div>
                {/* Si tu AgregarMotivacion ya existe, pasa onGuardar={handleAgregarMotivacion} */}
                {/* Ejemplo: <AgregarMotivacion onCerrar={()=>setMostrarAgregar(false)} onGuardar={handleAgregarMotivacion} /> */}
                {/* Si prefieres usar la versión que te pasé antes, habilita la línea de abajo (descomenta si existe) */}
                {/* <AgregarMotivacion onCerrar={() => setMostrarAgregar(false)} onGuardar={handleAgregarMotivacion} /> */}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MisMotivaciones;