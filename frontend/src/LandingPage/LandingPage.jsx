// src/LandingPage/LandingPage.jsx
import Header from "../LandingPage/components/Header";
import Hero from "../LandingPage/components/Hero";
import Benefits from "../LandingPage/components/Benefits";
import Footer from "../LandingPage/components/Footer";


function LandingPage() {
  return (
    <div className="App">
      <Header />
      <Hero />
      <Benefits />
      <Footer />
    </div>
  );
}

export default LandingPage;