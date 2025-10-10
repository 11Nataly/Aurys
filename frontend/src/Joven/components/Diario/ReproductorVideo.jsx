import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { FaTimes, FaWifi, FaRedo, FaSignal } from 'react-icons/fa';

const ReproductorVideo = ({ videoUrl, titulo, onClose }) => {
  const [tieneConexion, setTieneConexion] = useState(navigator.onLine);
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleOnline = () => setTieneConexion(true);
    const handleOffline = () => setTieneConexion(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!tieneConexion) {
    return (
      <div className="video-modal">
        <div className="video-error">
          <FaSignal size={48} />
          <h3>Este video requiere conexión a internet</h3>
          <p>Conéctate a internet para poder reproducir el video.</p>
          <button onClick={onClose} className="btn-cerrar">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="video-modal">
        <div className="video-error">
          <h3>No se pudo cargar el video</h3>
          <p>Intenta más tarde o contacta con soporte.</p>
          <button onClick={() => setError(false)} className="btn-reintentar">
            <FaRedo /> Reintentar
          </button>
          <button onClick={onClose} className="btn-cerrar">
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="video-modal">
      <div className="video-container">
        <div className="video-header">
          <h3>{titulo}</h3>
          <button onClick={onClose} className="btn-cerrar">
            <FaTimes />
          </button>
        </div>
        
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="400px"
          onError={() => setError(true)}
        />
        
        <div className="video-status">
          <FaWifi /> Conectado
        </div>
      </div>
    </div>
  );
};

export default ReproductorVideo;