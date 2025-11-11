import React, { useEffect, useState } from "react";
import { listarTecnicas, actualizarEstadoTecnica } from "../../services/tecnicasServicejoven";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import Pagination from "../components/Pagination/Pagination"; // ✅ IMPORTAR COMPONENTE DE PAGINACIÓN
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import "../../styles/afrontamiento.css";

const Afrontamiento = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verMas, setVerMas] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);
  
  // ✅ ESTADOS PARA PAGINACIÓN
  const [currentPage, setCurrentPage] = useState(1); // Página actual (empieza en 1)
  const itemsPerPage = 6; // Número de técnicas a mostrar por página

  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const userId = localStorage.getItem("id_usuario");
        const data = await listarTecnicas(userId);
        setTecnicas(data);
      } catch (error) {
        console.error("Error al cargar técnicas:", error);
      }
    };
    fetchTecnicas();
  }, []);

  // ✅ FILTRAR TÉCNICAS SEGÚN FAVORITOS
  const tecnicasFiltradas = mostrarFavoritos
    ? tecnicas.filter((t) => t.favorita)
    : tecnicas;

  // ✅ CÁLCULO DE PAGINACIÓN - OBTENER SOLO LAS TÉCNICAS DE LA PÁGINA ACTUAL
  const startIndex = (currentPage - 1) * itemsPerPage; // Índice inicial (ej: página 2: (2-1)*6 = 6)
  const endIndex = startIndex + itemsPerPage; // Índice final (ej: 6 + 6 = 12)
  const paginatedTecnicas = tecnicasFiltradas.slice(startIndex, endIndex); // Cortar array para mostrar solo técnicas de esta página

  const abrirModal = (tecnica) => {
    setSelected(tecnica);
    setVerMas(false);
  };

  const cerrarModal = () => {
    setSelected(null);
  };

  // ⭐ Calificar técnica
  const handleCalificar = async (id, estrellas) => {
    const userId = localStorage.getItem("id_usuario");
    try {
      setTecnicas((prev) =>
        prev.map((t) => (t.id === id ? { ...t, calificacion: estrellas } : t))
      );
      await actualizarEstadoTecnica(id, userId, estrellas, null);
    } catch (error) {
      console.error("Error al actualizar calificación:", error);
    }
  };

  // ❤️ Marcar o quitar favorito
  const toggleFavorito = async (id) => {
    const userId = localStorage.getItem("id_usuario");
    const tecnica = tecnicas.find((t) => t.id === id);
    const nuevoEstado = !tecnica.favorita;

    try {
      setTecnicas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, favorita: nuevoEstado } : t
        )
      );
      await actualizarEstadoTecnica(id, userId, null, nuevoEstado);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  // ✅ RESETEAR A PÁGINA 1 CUANDO CAMBIE EL FILTRO DE FAVORITOS
  // Esto evita que el usuario quede en una página que no existe después de filtrar
  React.useEffect(() => {
    setCurrentPage(1); // Siempre volver a la primera página al cambiar filtros
  }, [mostrarFavoritos]);

  // ✅ MANEJADOR DE CAMBIO DE PÁGINA
  const handlePageChange = (page) => {
    setCurrentPage(page); // Actualizar la página actual
    // Scroll suave hacia arriba para mejor experiencia de usuario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Breadcrumb />

      <div className="page-content">
        <div className="page-header">
          <div className="header-content">
            <div className="header-titles">
              <h1>Técnicas de Afrontamiento</h1>
              <h2>Gestiona tu bienestar emocional</h2>
            </div>

            <button
              className={`filtro-favoritos-btn ${mostrarFavoritos ? "active" : ""}`}
              onClick={() => setMostrarFavoritos(!mostrarFavoritos)}
            >
              {mostrarFavoritos ? "Ver todas" : "Ver favoritos"}
            </button>
          </div>
        </div>

        {/* ✅ MOSTRAR SOLO LAS TÉCNICAS PAGINADAS (NO TODAS) */}
        <div className="tecnicas-grid">
          {paginatedTecnicas.map((tecnica) => (
            <div key={tecnica.id} className="tecnica-card">
              <div className="card-header">
                <h3 className="tecnica-titulo">{tecnica.nombre}</h3>
                <div className="duracion-circulo">{tecnica.duracion}</div>
              </div>

              <div className="card-content">
                <p className="tecnica-descripcion">{tecnica.descripcion}</p>
              </div>

              <div className="card-footer">
                <div className="calificacion-container">
                  <div className="estrellas">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`star-btn ${
                          (tecnica.calificacion || 0) >= star ? "active" : ""
                        }`}
                        onClick={() => handleCalificar(tecnica.id, star)}
                        aria-label={`Calificar con ${star} estrellas`}
                      >
                        {(tecnica.calificacion || 0) >= star ? (
                          <FaStar />
                        ) : (
                          <FaRegStar />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    className={`favorito-btn ${tecnica.favorita ? "active" : ""}`}
                    onClick={() => toggleFavorito(tecnica.id)}
                    aria-label="Marcar como favorito"
                  >
                    {tecnica.favorita ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>

                <div className="acciones-container">
                  <button
                    className="btn btn-detalles"
                    onClick={() => abrirModal(tecnica)}
                  >
                    Ver detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ COMPONENTE DE PAGINACIÓN - SE RENDERIZA SOLO SI HAY SUFICIENTES ELEMENTOS */}
        <Pagination
          currentPage={currentPage} // Página actual seleccionada
          totalItems={tecnicasFiltradas.length} // Total de técnicas después del filtro
          itemsPerPage={itemsPerPage} // Técnicas por página (6)
          onPageChange={handlePageChange} // Función que se ejecuta al cambiar de página
          maxVisiblePages={5} // Máximo de números de página visibles en la navegación
          className="afrontamiento-pagination" // Clase CSS personalizada
          // Props opcionales con valores por defecto:
          // showTotal={true} - Muestra "Mostrando X-Y de Z elementos"
          // showPageNumbers={true} - Muestra los números de página
          // showNavigation={true} - Muestra botones anterior/siguiente
        />

        {selected && (
          <div className="modal-overlay">
            <div className="modal modal-detalles">
              <div className="modal-header">
                <h2>{selected.nombre}</h2>
                <button className="btn-cerrar" onClick={cerrarModal}>
                  ✖
                </button>
              </div>

              <div className="modal-content">
                <div className="modal-grid">
                  <div className="modal-seccion">
                    {selected.video ? (
                      <div className="video-integrado-container">
                        <video
                          src={selected.video}
                          controls
                          className="video-integrado"
                        />
                      </div>
                    ) : (
                      <p className="sin-video">No hay video disponible</p>
                    )}

                    <div className="duracion-info">
                      <p>
                        <strong>Duración:</strong> {selected.duracion}
                      </p>
                    </div>
                  </div>

                  <div className="modal-seccion">
                    <h3>Descripción</h3>
                    <p className="modal-descripcion">{selected.descripcion}</p>

                    <h3>Instrucciones</h3>
                    <p className="modal-descripcion">
                      {verMas
                        ? selected.instruccion
                        : selected.instruccion.slice(0, 80) + "..."}
                    </p>
                    {selected.instruccion.length > 80 && (
                      <button
                        className="btn btn-detalles"
                        onClick={() => setVerMas(!verMas)}
                        style={{ marginTop: "10px" }}
                      >
                        {verMas ? "Ver menos" : "Ver más"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Afrontamiento;