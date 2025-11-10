import { useState, useEffect } from "react";
import DiarioHeader from "../components/Diario/DiarioHeader";
import EditorDiario from "../components/Diario/EditorDiario";
import HistorialEntradas from "../components/Diario/HistorialEntradas";
import AgregarEntrada from "../components/Diario/AgregarEntrada";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Pagination from "../components/Pagination/Pagination"; // ✅ Importamos paginación
import { obtenerNotasPorUsuario } from "../../services/notasService"; // ✅ Importar conexión backend
import "../../styles/diario.css";

const Diario = () => {
  const [vistaActual, setVistaActual] = useState("editor");
  const [entradas, setEntradas] = useState([]);
  const [entradaEditando, setEntradaEditando] = useState(null);

  // 🔹 Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 5–8 recomendado para listas según guía

  // 🔹 Cargar desde backend
  useEffect(() => {
    const cargarNotas = async () => {
      try {
        const id_usuario = localStorage.getItem("id_usuario");
        if (!id_usuario) throw new Error("Usuario no encontrado");
        const data = await obtenerNotasPorUsuario(id_usuario);
        setEntradas(data.reverse());
      } catch (error) {
        console.error("❌ Error cargando notas:", error);
      }
    };
    cargarNotas();
  }, []);

  // 🔹 Cálculo de paginación
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const entradasPaginadas = entradas.slice(startIndex, endIndex);

  // 🔹 Manejador de cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🔹 Reset al cambiar de vista
  useEffect(() => {
    if (vistaActual === "historial") setCurrentPage(1);
  }, [vistaActual]);

  const eliminarEntrada = (id) => {
    setEntradas((prev) => prev.filter((e) => e.id !== id));
  };

  const renderVista = () => {
    switch (vistaActual) {
      case "historial":
        return (
          <div className="historial-container">
            <HistorialEntradas
              entradas={entradasPaginadas}
              entradasTotales={entradas}
              onEliminar={eliminarEntrada}
              onVolver={() => setVistaActual("editor")}
            />

            {/* 🔹 Mostrar paginación solo si hay más de X entradas */}
            {entradas.length > itemsPerPage && (
              <div className="diario-pagination-container">
                <Pagination
                  currentPage={currentPage}
                  totalItems={entradas.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  maxVisiblePages={5}
                  className="diario-pagination"
                  showTotal={true}
                />
              </div>
            )}
          </div>
        );

      case "agregar":
        return (
          <AgregarEntrada
            entrada={entradaEditando}
            onGuardar={() => setVistaActual("editor")}
            onCancelar={() => setVistaActual("editor")}
          />
        );

      default:
        return (
          <EditorDiario
            entradas={entradas}
            onAgregarEntrada={() => {
              setEntradaEditando(null);
              setVistaActual("agregar");
            }}
          />
        );
    }
  };

  return (
    <>
      <Breadcrumb />
      <div className="diario-container">
        <DiarioHeader vistaActual={vistaActual} onCambiarVista={setVistaActual} />
        {renderVista()}
      </div>
    </>
  );
};

export default Diario;
