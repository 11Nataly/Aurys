// src/components/Benefits/Benefits.jsx
import './Benefits.css';

// Importar las imágenes locales
import bienestarEmocional from './images/bienestaremocional.jpg';
import misMotivaciones from './images/mismotivaciones.jpg';
import seguimientoPromesas from './images/seguimientodepromesas.jpg';
import expresionLibre from './images/expresiónlibre.jpg';
import kitEmergencia from './images/kitdeemergencia.jpg';
import pequenosPasos from './images/pequeñospasos.jpg';

const Benefits = () => {
  const benefits = [
    {
      title: "Bienestar emocional",
      description: "Encuentra calma y reflexiona en un espacio seguro",
      image: bienestarEmocional
    },
    {
      title: "Mis motivaciones",
      description: "Crea y organiza frases, imágenes y recuerdos que te inspiren y eleven tu ánimo cuando lo necesites",
      image: misMotivaciones
    },
    {
      title: "Seguimiento de promesas",
      description: "Establece compromisos contigo mismo y haz seguimiento de tu progreso para construir hábitos saludables",
      image: seguimientoPromesas
    },
    {
      title: "Expresión libre",
      description: "Registra y haz seguimiento de tus emociones diarias para reflexionar sobre tu evolución personal",
      image: expresionLibre
    },
    {
      title: "Kit de emergencia",
      description: "Accede rápidamente a técnicas de relajación y líneas de apoyo en momentos de crisis emocional",
      image: kitEmergencia
    },
    {
      title: "Pequeños pasos",
      description: "Avanza a tu ritmo, sin presión",
      image: pequenosPasos
    }
  ];

  return (
    <section id="beneficios" className="benefits">
      <div className="container">
        <h2 className="benefits-title">Beneficios principales</h2>
        <div className="benefits-grid">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-image">
                <img 
                  src={benefit.image} 
                  alt={benefit.title}
                />
              </div>
              <div className="benefit-content">
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;