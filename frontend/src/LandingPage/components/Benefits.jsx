// src/components/Benefits/Benefits.jsx
import './Benefits.css';

const Benefits = () => {
  const benefits = [
    {
      title: "Bienestar emocional",
      description: "Encuentra calma y reflexiona en un espacio seguro",
      image: "/src/assets/images/imagentexto.jpeg"
    },
    {
      title: "Mis motivaciones",
      description: "Crea y organiza frases, imágenes y recuerdos que te inspiren y eleven tu ánimo cuando lo necesites",
      image: "/src/assets/images/motivacion.jpg"
    },
    {
      title: "Seguimiento de promesas",
      description: "Establece compromisos contigo mismo y haz seguimiento de tu progreso para construir hábitos saludables",
      image: "/src/assets/images/promesa.jpg"
    },
    {
      title: "Expresión libre",
      description: "Registra y haz seguimiento de tus emociones diarias para reflexionar sobre tu evolución personal",
      image: "/src/assets/images/expresionLibre.jpg"
    },
    {
      title: "Kit de emergencia",
      description: "Accede rápidamente a técnicas de relajación y líneas de apoyo en momentos de crisis emocional",
      image: "/src/assets/images/kitEmergencia.jpg"
    },
    {
      title: "Pequeños pasos",
      description: "Avanza a tu ritmo, sin presión",
      image: "/src/assets/images/pequeñosPasos.jpg"
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
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/80x80/667eea/ffffff?text=${benefit.title.split(' ')[0]}`;
                  }}
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