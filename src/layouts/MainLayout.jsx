// src/layout/MainLayout.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/layout.css";

const MainLayout = ({ children }) => {
  return (
    <div className="layout">
      
      <Sidebar />
      <div className="main-content">
        <Header />
        <div className="page-content">{children}</div>
        <Footer />
        
      </div>
    </div>
  );
};

export default MainLayout;