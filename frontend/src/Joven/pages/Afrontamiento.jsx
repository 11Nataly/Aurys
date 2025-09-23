import React, { useEffect, useState } from "react";
import { listarTecnicas } from "../../services/tecnicasServicejoven";
import "../../styles/afrontamiento.css";

const Afrontamiento = () => {
  const [tecnicas, setTecnicas] = useState([]);
  const [selected, setSelected] = useState(null); // técnica seleccionada
  const [verMas, setVerMas] = useState(false);

  useEffect(() => {
    const fetchTecnicas = async () => {
      try {
        const userId = localStorage.getItem("userId"); // obtener id desde localStorage
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

  return (
    <div className="afrontamiento-container">
      <h2>Técnicas de Afrontamiento</h2>
      <div className="tecnicas-grid">
        {tecnicas.map((tecnica) => (
          <div key={tecnica.id} className="tecnica-card">
            <h3>{tecnica.nombre}</h3>
            <p className="descripcion">{tecnica.descripcion}</p>
            <p><strong>Duración:</strong> {tecnica.duracion}</p>

            <button
              onClick={() => abrirModal(tecnica)}
              className="btn-detalle"
            >
              Ver detalles
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={cerrarModal}>
              ✖
            </button>
            <h2>{selected.nombre}</h2>

            {selected.video ? (
              <video src={selected.video} controls className="video-player" />
            ) : (
              <p className="sin-video">No hay video disponible</p>
            )}

            <p><strong>Descripción:</strong> {selected.descripcion}</p>
            <p><strong>Duración:</strong> {selected.duracion}</p>

            <h4>Instrucciones:</h4>
            <p>
              {verMas
                ? selected.instruccion
                : selected.instruccion.slice(0, 80) + "..."}
            </p>
            {selected.instruccion.length > 80 && (
              <button
                className="btn-vermas"
                onClick={() => setVerMas(!verMas)}
              >
                {verMas ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Afrontamiento;
