// src/LandingPage/LandingPage.jsx
import Header from "./components/Header";
import Hero from "./components/Hero";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      <Header />
      <main>
        <Hero />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;