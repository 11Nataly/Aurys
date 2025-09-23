import React, { useEffect, useState } from "react";
import {
  listarTecnicasAdmin,
  crearTecnica,
  subirVideo,
  eliminarTecnica, // ✅ nuevo servicio
} from "../../services/tecnicasService";
import AddGuideModal from "../components/AddGuideModal";
import "./GuideManagement.css";

export default function GuideManagement() {
  const [tecnicas, setTecnicas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTecnica, setSelectedTecnica] = useState(null);

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

  // 📌 Crear técnica
  const handleAddGuide = async (formData = {}, videoFile = null) => {
    try {
      const usuarioId = parseInt(localStorage.getItem("id_usuario"), 10);
      if (!usuarioId) {
        alert("⚠️ No se encontró id_usuario en localStorage");
        return;
      }

      const nombre =
        formData.title ?? formData.nombre ?? formData.name ?? "Sin título";
      const descripcion =
        formData.description ??
        formData.descripcion ??
        formData.desc ??
        "Sin descripción";
      const instruccion =
        formData.instructions ??
        formData.instruccion ??
        formData.instruction ??
        "Sin instrucciones";

      const horas = Number(
        formData.durationHours ?? formData.horas ?? formData.hours ?? 0
      );
      const minutos = Number(
        formData.durationMinutes ?? formData.minutos ?? formData.minutes ?? 0
      );
      const segundos = Number(
        formData.durationSeconds ?? formData.segundos ?? formData.seconds ?? 0
      );

      const tecnicaData = {
        usuario_id: usuarioId,
        nombre,
        descripcion,
        instruccion,
        duracion_video: horas * 3600 + minutos * 60 + segundos,
        horas,
        minutos,
        segundos,
        activo: 1,
      };

      const tecnicaCreada = await crearTecnica(tecnicaData);

      const fileToUpload =
        videoFile ?? formData.file ?? formData.videoFile ?? null;

      if (fileToUpload) {
        try {
          await subirVideo(tecnicaCreada.id, fileToUpload);
        } catch (err) {
          alert(
            "Error subiendo video: " +
              (err.response?.data || err.message || err)
          );
        }
      }

      await fetchTecnicas();
      setShowModal(false);
    } catch (error) {
      alert(
        "Error al agregar técnica: " +
          (error.response?.data || error.message || error)
      );
    }
  };

  // 📌 Editar técnica
  const handleEdit = (tecnica) => {
    setSelectedTecnica(tecnica);
    setShowModal(true);
  };

  //  Eliminar técnica
const handleDelete = async (tecnica) => {
  if (window.confirm(`¿Estás seguro de eliminar "${tecnica.nombre}"?`)) {
    try {
      await eliminarTecnica(tecnica.id); //  se pasa el id
      alert(" Técnica eliminada correctamente");
      fetchTecnicas(); // recarga la lista
    } catch (err) {
      alert(" Error al eliminar técnica: " + (err.detail || err.message || err));
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
          {tecnicas.map((tecnica, index) => (
            <tr key={tecnica.id ?? `tecnica-${index}`}>
              <td>{tecnica.nombre}</td>
              <td>{tecnica.descripcion}</td>
              <td>
                <span className="gm-duration">
                  {tecnica.duracion ??
                    `${tecnica.horas ?? 0}h ${tecnica.minutos ?? 0}m ${
                      tecnica.segundos ?? 0
                    }s`}
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
                    onClick={() => handleDelete(tecnica)}
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
