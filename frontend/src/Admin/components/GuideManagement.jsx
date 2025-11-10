import React, { useEffect, useState } from "react";
import {
  listarTecnicasAdmin,
  crearTecnica,
  subirVideo,
  editarTecnica,
  eliminarTecnica,
} from "../../services/tecnicasService";
import AddGuideModal from "../components/AddGuideModal";
import Pagination from "../../Joven/components/Pagination/Pagination"; // ✅ LÍNEA 6: Importar componente de paginación
import "./GuideManagement.css";

export default function GuideManagement() {
  const [tecnicas, setTecnicas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTecnica, setSelectedTecnica] = useState(null);

  // ✅ LÍNEA 14-15: Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 técnicas por página

  // 📌 Cargar técnicas
  const fetchTecnicas = async () => {
    try {
      const data = await listarTecnicasAdmin();
      setTecnicas(data);
    } catch (error) {
      alert(
        "Error al listar técnicas: " +
          (error.response?.data || error.message || error)
      );
    }
  };

  useEffect(() => {
    fetchTecnicas();
  }, []);

  // ✅ LÍNEA 32-36: Calcular técnicas paginadas
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTecnicas = tecnicas.slice(startIndex, endIndex);

  // ✅ LÍNEA 39-43: Manejador de cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll suave hacia arriba de la tabla
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 📌 Crear o editar técnica
  const handleAddGuide = async (formData = {}, videoFile = null) => {
    try {
      const usuarioId = parseInt(localStorage.getItem("id_usuario"), 10);
      if (!usuarioId) {
        alert("⚠️ No se encontró id_usuario en localStorage");
        return;
      }

      const nombre = formData.title ?? formData.nombre ?? "Sin título";
      const descripcion = formData.description ?? formData.descripcion ?? "Sin descripción";
      const instruccion = formData.instructions ?? formData.instruccion ?? "Sin instrucciones";

      const horas = Number(formData.durationHours ?? formData.horas ?? 0);
      const minutos = Number(formData.durationMinutes ?? formData.minutos ?? 0);
      const segundos = Number(formData.durationSeconds ?? formData.segundos ?? 0);

      const tecnicaData = {
        id: selectedTecnica?.id,
        usuario_id: usuarioId,
        nombre,
        descripcion,
        instruccion,
        horas,
        minutos,
        segundos,
        duracion_video: horas * 3600 + minutos * 60 + segundos,
        activo: 1,
      };

      let tecnicaProcesada;
      if (selectedTecnica) {
        // 👈 Editar
        tecnicaProcesada = await editarTecnica(tecnicaData);
      } else {
        // 👈 Crear
        tecnicaProcesada = await crearTecnica(tecnicaData);

        // si hay video y es nuevo, subir
        const fileToUpload = videoFile ?? formData.file ?? null;
        if (fileToUpload) {
          try {
            await subirVideo(tecnicaProcesada.id, fileToUpload);
          } catch (err) {
            alert("Error subiendo video: " + (err.response?.data || err.message || err));
          }
        }
      }

      await fetchTecnicas();
      setShowModal(false);
      setSelectedTecnica(null);
      
      // ✅ LÍNEA 84: Resetear a página 1 después de crear/editar
      setCurrentPage(1);
    } catch (error) {
      alert("Error al guardar técnica: " + (error.response?.data || error.message || error));
    }
  };

  // 📌 Editar técnica
  const handleEdit = (tecnica) => {
    setSelectedTecnica(tecnica);
    setShowModal(true);
  };

  // 📌 Eliminar técnica
  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta técnica?")) {
      try {
        await eliminarTecnica(id);
        setTecnicas(tecnicas.filter((t) => t.id !== id));
        alert("Técnica eliminada correctamente");
        
        // ✅ LÍNEA 104-107: Ajustar paginación si se elimina la última técnica de la página
        if (paginatedTecnicas.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        console.error("Error eliminando técnica:", err);
        alert("Error al eliminar la técnica: " + (err.response?.data || err.message || err));
      }
    }
  };

  return (
    <div className="gm-container">
      <div className="gm-header">
        <h1 className="gm-title">Guías de Afrontamiento</h1>
        <button onClick={() => setShowModal(true)} className="gm-add-btn">
          <i className="fas fa-plus"></i> Agregar Guía
        </button>
      </div>

      {/* ✅ LÍNEA 122-128: Información de paginación */}
      <div className="gm-table-info">
        Mostrando {paginatedTecnicas.length} de {tecnicas.length} técnicas
        {tecnicas.length > itemsPerPage && (
          <span className="gm-page-info"> - Página {currentPage} de {Math.ceil(tecnicas.length / itemsPerPage)}</span>
        )}
      </div>

      <table className="gm-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Descripción</th>
            <th>Duración</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* ✅ LÍNEA 140: Usar técnicas paginadas en lugar de todas */}
          {paginatedTecnicas.map((tecnica, index) => (
            <tr key={tecnica.id ?? `tecnica-${index}`}>
              <td>{tecnica.nombre}</td>
              <td>
                <div className="gm-description-cell">
                  {tecnica.descripcion}
                </div>
              </td>
              <td>
                <span className="gm-duration">
                  {tecnica.duracion ??
                    `${tecnica.horas ?? 0}h ${tecnica.minutos ?? 0}m ${tecnica.segundos ?? 0}s`}
                </span>
              </td>
              <td>
                <div className="gm-action-buttons">
                  <button
                    className="gm-action-btn gm-action-btn-warning"
                    onClick={() => handleEdit(tecnica)}
                  >
                    <i className="fas fa-edit"></i> Editar
                  </button>
                  <button
                    className="gm-action-btn gm-action-btn-danger"
                    onClick={() => handleDelete(tecnica.id)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ LÍNEA 167-180: Componente de paginación */}
      {tecnicas.length > itemsPerPage && (
        <div className="gm-pagination-container">
          <Pagination
            currentPage={currentPage}
            totalItems={tecnicas.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            maxVisiblePages={5}
            className="gm-pagination"
            showTotal={false} // Ya mostramos la info arriba
            showPageNumbers={true}
            showNavigation={true}
          />
        </div>
      )}

      <AddGuideModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedTecnica(null);
        }}
        onSave={handleAddGuide}
        guideData={selectedTecnica}
        mode={selectedTecnica ? "edit" : "add"}
      />
    </div>
  );
}