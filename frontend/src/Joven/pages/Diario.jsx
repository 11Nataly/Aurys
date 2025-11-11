import { useState, useEffect } from "react";
import DiarioHeader from "../components/Diario/DiarioHeader";
import EditorDiario from "../components/Diario/EditorDiario";
import HistorialEntradas from "../components/Diario/HistorialEntradas";
import AgregarEntrada from "../components/Diario/AgregarEntrada";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Pagination from "../components/Pagination/Pagination";
import { obtenerNotasPorUsuario } from "../../services/notasService";
import "../../styles/diario.css";

const Diario = () => {
  const [vistaActual, setVistaActual] = useState("editor");
  const [entradas, setEntradas] = useState([]);
  const [entradaEditando, setEntradaEditando] = useState(null);

  // 🔹 Estados de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔹 Cargar desde backend
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

  useEffect(() => {
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

  // 🔹 Eliminar entrada localmente
  const eliminarEntrada = (id) => {
    setEntradas((prev) => prev.filter((e) => e.id !== id));
  };

  // ✅ Actualizar automáticamente el historial cuando se agrega una nueva entrada
  const handleGuardarNuevaEntrada = (nuevaEntrada) => {
    if (!nuevaEntrada) return;
    setEntradas((prev) => [nuevaEntrada, ...prev]); // Agrega la nueva entrada al inicio
    setVistaActual("historial"); // Cambia al historial automáticamente
    setCurrentPage(1); // Muestra en la primera página
  };

  // ✅ Actualizar automáticamente el historial cuando se edita una entrada existente
  const handleActualizarEntradaEditada = (entradaEditada) => {
    if (!entradaEditada) return;
    setEntradas((prev) =>
      prev.map((entrada) =>
        entrada.id === entradaEditada.id ? entradaEditada : entrada
      )
    );
    setVistaActual("historial"); // Cambia al historial actualizado
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
            onGuardar={
              entradaEditando
                ? handleActualizarEntradaEditada // ✅ Edición
                : handleGuardarNuevaEntrada // ✅ Creación
            }
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
