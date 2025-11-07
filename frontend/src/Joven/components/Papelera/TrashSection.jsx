import React, { useState, useEffect } from "react";
import "./TrashSection.css";
import {
  obtenerPromesasPapelera,
  obtenerNotasPapelera,
  obtenerMotivacionesPapelera,
  restaurarElemento,
  eliminarDefinitivo,
} from "../../../services/papeleraService.js";

export default function TrashSection({ usuarioId = 1 }) {
  const [activeTab, setActiveTab] = useState("Promesas");
  const [trashItems, setTrashItems] = useState({
    Promesas: [],
    "Entradas de Diario": [],
    Motivaciones: [],
  });
  const [loading, setLoading] = useState(true);
  const [notif, setNotif] = useState(null);
  const [error, setError] = useState(null);

  const categories = ["Promesas", "Entradas de Diario", "Motivaciones"];

  // ===============================
  // 🔹 Cargar datos iniciales
  // ===============================
  const fetchTrash = async () => {
    setLoading(true);
    setError(null);

    try {
      const [promesas, diarios, motivaciones] = await Promise.all([
        obtenerPromesasPapelera(usuarioId).catch(() => []), // Si hay error, devuelve vacío
        obtenerNotasPapelera(usuarioId).catch(() => []),
        obtenerMotivacionesPapelera(usuarioId).catch(() => []),
      ]);

      setTrashItems({
        Promesas: promesas || [],
        "Entradas de Diario": diarios || [],
        Motivaciones: motivaciones || [],
      });
    } catch (err) {
      // ⚠️ Si no hay datos, no mostramos error general
      setError("No hay elementos en la papelera");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  // ===============================
  // 🔹 Restaurar elemento
  // ===============================
  const handleRestore = async (item, category) => {
    try {
      await restaurarElemento(category, item.id);
      setTrashItems((prev) => ({
        ...prev,
        [category]: prev[category].filter((x) => x.id !== item.id),
      }));
      setNotif("✅ Elemento restaurado correctamente");
    } catch (err) {
      setNotif("❌ Error al restaurar: " + (err.message || "Error desconocido"));
    }
  };

  // ===============================
  // 🔹 Eliminar definitivamente
  // ===============================
  const handleDelete = async (item, category) => {
    if (!window.confirm("¿Eliminar definitivamente este elemento?")) return;
    try {
      await eliminarDefinitivo(category, item.id);
      setTrashItems((prev) => ({
        ...prev,
        [category]: prev[category].filter((x) => x.id !== item.id),
      }));
      setNotif("🗑️ Elemento eliminado permanentemente");
    } catch (err) {
      setNotif("❌ Error al eliminar: " + (err.message || "Error desconocido"));
    }
  };

  // ===============================
  // 🔹 UI
  // ===============================
  if (loading) {
    return (
      <div className="container">
        <h1>Papelera</h1>
        <p>Cargando elementos...</p>
      </div>
    );
  }

  const currentItems = trashItems[activeTab] || [];
  const isEmpty = currentItems.length === 0;

  return (
    <div className="container">
      <h1>Papelera</h1>

      {/* 🔹 Notificación simple */}
      {notif && (
        <div className="notif" onClick={() => setNotif(null)}>
          {notif}
        </div>
      )}

      {/* 🔹 Tabs */}
      <div className="tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeTab === cat ? "active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido */}
      <div className="trash-section">
        <h2 className="category-title">{activeTab}</h2>

        {isEmpty ? (
          <p className="empty-category">
            {activeTab === "Entradas de Diario"
              ? "No hay notas de usuario"
              : `No hay ${activeTab.toLowerCase()} eliminadas`}
          </p>
        ) : (
          currentItems.map((item) => (
            <div key={item.id} className="trash-item">
              <div className="item-title">{item.titulo || item.nombre}</div>
              <div className="item-meta">
                <span className="item-date">
                  Eliminado:{" "}
                  {item.updated_at
                    ? new Date(item.updated_at).toLocaleDateString()
                    : "—"}
                </span>
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-restore"
                  onClick={() => handleRestore(item, activeTab)}
                >
                  Restaurar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(item, activeTab)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
