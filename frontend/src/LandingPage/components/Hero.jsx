//src/components/Hero/Hero.jsx
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1>Aurys: tu espacio seguro para cuidar la mente y el corazón</h1>
          <p>
            Aurys es más que una aplicación: es un refugio digital diseñado para jóvenes 
            que atraviesan etapas de ansiedad o depresión. Queremos brindarte un entorno 
            acogedor, lleno de mensajes positivos y recursos que te recuerdan que siempre 
            hay un nuevo comienzo.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Comenzar ahora</button>
            <button className="btn-secondary">Explorar más</button>
          </div>
        </div>
        
        <div className="hero-image">
          <img 
            src="/src/assets/images/imagentexto.jpeg" 
            alt="Aurys - Bienestar emocional"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;