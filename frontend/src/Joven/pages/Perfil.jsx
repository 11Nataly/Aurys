import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/Perfil/ProfileHeader";
import ProfileInfo from "../components/Perfil/Profileinfo";
import "../../styles/perfil.css";
import { listarPerfiles } from "../../services/perfilService";
import { jwtDecode } from "jwt-decode";

const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const decoded = jwtDecode(token);
        const userId = Number(decoded.sub || decoded.id || decoded.user_id);
        const perfiles = await listarPerfiles();
        const user = perfiles.find((p) => p.id === userId);
        if (user) setUserData(user);
      } catch (error) {
        console.error("Error cargando perfil:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  const handleUpdateUser = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) return <p>Cargando perfil...</p>;
  if (!userData) return <p>No se encontró información del perfil.</p>;

  return (
    <div className="perfil-container">
      <h1 className="perfil-title">Mi Perfil</h1>
      <div className="perfil-content">
        <ProfileHeader userData={userData} onUpdateUser={handleUpdateUser} />
        <ProfileInfo userData={userData} onUpdateUser={handleUpdateUser} />
      </div>
    </div>
  );
};

export default Perfil;
