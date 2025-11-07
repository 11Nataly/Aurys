import React, { useEffect, useState } from "react";
import { listarTecnicas, actualizarEstadoTecnica } from "../../services/tecnicasServicejoven";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { FaStar, FaRegStar, FaHeart, FaRegHeart } from "react-icons/fa";
import "../../styles/afrontamiento.css";

const Afrontamiento = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [selected, setSelected] = useState(null);
  const [verMas, setVerMas] = useState(false);
  const [mostrarFavoritos, setMostrarFavoritos] = useState(false);

  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const userId = localStorage.getItem("id_usuario"); // ✅ usar la misma clave
        const data = await listarTecnicas(userId);
        setTecnicas(data);
      } catch (error) {
        console.error("Error al cargar técnicas:", error);
      }
    };
    fetchTecnicas();
  }, []);

  const abrirModal = (tecnica) => {
    setSelected(tecnica);
    setVerMas(false);
  };

  const cerrarModal = () => {
    setSelected(null);
  };

  // ⭐ Calificar técnica
  const handleCalificar = async (id, estrellas) => {
    const userId = localStorage.getItem("id_usuario"); // ✅ corregido
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
    const userId = localStorage.getItem("id_usuario"); // ✅ corregido
    const tecnica = tecnicas.find((t) => t.id === id);
    const nuevoEstado = !tecnica.favorita;

    try {
      // Actualiza visualmente
      setTecnicas((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, favorita: nuevoEstado } : t
        )
      );

      // ✅ Llama al backend pasando el nuevo estado del favorito
      await actualizarEstadoTecnica(id, userId, null, nuevoEstado);
    } catch (error) {
      console.error("Error al actualizar favorito:", error);
    }
  };

  const tecnicasFiltradas = mostrarFavoritos
    ? tecnicas.filter((t) => t.favorita)
    : tecnicas;

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

        <div className="tecnicas-grid">
          {tecnicasFiltradas.map((tecnica) => (
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
