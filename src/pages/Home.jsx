// src/pages/Home.jsx
import EmergencyTable from "../components/EmergencyTable";
import "../styles/home.css";


const Home = () => {
  return (
    <div className="home">
      <div className="cards">
        <div className="card">
          <h3>Diario</h3>
          <p>
            Tu diario es ese amigo que siempre te escucha en silencio...
          </p>
          <button>Escribir ahora</button>
        </div>
        <div className="card">
          <h3>afrontamiento</h3>
          <p>
            Las técnicas de afrontamiento son como amigos sabios...
          </p>
          <button>Ir ahora</button>
        </div>
      </div>

      <EmergencyTable />
    </div>
  );
};

export default Home;