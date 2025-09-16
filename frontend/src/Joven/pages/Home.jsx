import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, BookOpen, Shield, Phone } from "lucide-react";
import EmergencyKit from "../components/KitEmergencia/EmergencyKit";
import "../components/Home/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleAfrontamientoClick = () => {
    navigate("/joven/afrontamiento");
  };

  const handleDiarioClick = () => {
    navigate("/joven/diario");
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="home">
      {/* Tarjeta de bienvenida con animación */}
      <motion.div 
        className="welcome-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="welcome-icon">
          <Heart size={48} />
        </div>
        <div className="welcome-text">
          <h2>Bienvenido a tu espacio seguro</h2>
          <p>Aquí encontrarás herramientas para tu bienestar emocional, incluyendo tu diario personal, técnicas de afrontamiento y líneas de emergencia disponibles cuando las necesites.</p>
        </div>
      </motion.div>

      {/* Tarjetas de Diario y Afrontamiento */}
      <div className="cards-container">
        <motion.div 
          className="cards"
          variants={cardVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <motion.div 
            className="card"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="card-icon">
              <BookOpen size={40} />
            </div>
            <h3>Diario</h3>
            <p>
              Tu diario es ese amigo que siempre te escucha en silencio. Tómate un 
              momento para contarle cómo te sientes hoy. Las palabras escritas tienen
              el poder de aliviar lo que el corazón guarda.
            </p>
            <motion.button 
              onClick={handleDiarioClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Escribir ahora
            </motion.button>
          </motion.div>

          <motion.div 
            className="card"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="card-icon">
              <Shield size={40} />
            </div>
            <h3>Afrontamiento</h3>
            <p>
              Las técnicas de afrontamiento son como amigos sabios que te susurran 
              opciones cuando más las necesitas. Mira esta lista, elige la que haga 
              click contigo hoy. A veces, un solo gesto puede cambiar tu día.
            </p>
            <motion.button 
              onClick={handleAfrontamientoClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ir ahora
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Sección de Líneas de Emergencia */}
      <motion.div 
        className="emergency-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="emergency-header">
          <Phone size={32} className="emergency-icon" />
          <h2 className="emergency-title">Líneas de emergencia</h2>
        </div>
        <EmergencyKit minimal={true} />
      </motion.div>
    </div>
  );
}