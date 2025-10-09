// src/Joven/pages/KitEmergencia.jsx
import EmergencyKit from "../components/KitEmergencia/EmergencyKit";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb"; // ✅ Importamos

export default function KitEmergencia() {
  return (
    <>
      {/* ✅ BREADCRUMB ARRIBA Y FUERA */}
      <Breadcrumb />

      <div className="page-inner">
        <EmergencyKit />
      </div>
    </>
  );
}