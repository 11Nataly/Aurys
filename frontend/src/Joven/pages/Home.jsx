// src/Joven/pages/Home.jsx
import React from 'react';
import '../components/Home/home.css'; // Asegúrate de que esta ruta sea correcta

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a Aurys</h1>
      <p>Tu compañero en salud mental</p>
      
      <div className="home-grid">
        <div className="feature-card">
          <h2>📖 Diario</h2>
          <p>Expresa tus pensamientos y emociones en un espacio seguro</p>
        </div>
        
        <div className="feature-card">
          <h2>🆘 Kit de Emergencia</h2>
          <p>Herramientas y técnicas para momentos difíciles</p>
        </div>
        
        <div className="feature-card">
          <h2>🤝 Promesas</h2>
          <p>Compromisos contigo mismo para tu bienestar</p>
        </div>
      </div>
    </div>
  );
};

export default Home;