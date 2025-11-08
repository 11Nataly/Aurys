import React, { useState, useEffect } from "react";
import "./TrashSection.css";
import {
  getTrashItems,
  restoreItem,
  deleteItem
} from "../../../services/trashService";

export default function TrashSection() {
  const [usuarioId, setUsuarioId] = useState(null);
  const [activeTab, setActiveTab] = useState("promesas");
  const [trashData, setTrashData] = useState({
    promesas: [],
    diario: [],
    motivaciones: [],
    categorias: [],
  });
  const [loading, setLoading] = useState(false);

  const tabs = [
    { key: "promesas", label: "Promesas" },
    { key: "diario", label: "Entradas de Diario" },
    { key: "motivaciones", label: "Motivaciones" },
    { key: "categorias", label: "Categorías" },
  ];

  // 🔹 Obtener usuario desde localStorage al montar
  useEffect(() => {
    const id = localStorage.getItem("id_usuario");
    if (id) {
      setUsuarioId(id);
    } else {
      console.warn("⚠️ No se encontró 'id_usuario' en localStorage");
    }
  }, []);

  // 🔹 Cargar elementos de la papelera según la pestaña activa
  const loadTrash = async (tipo) => {
    if (!usuarioId) return;
    setLoading(true);
    const data = await getTrashItems(usuarioId, tipo);
    setTrashData((prev) => ({ ...prev, [tipo]: data }));
    setLoading(false);
  };

  useEffect(() => {
    if (usuarioId) loadTrash(activeTab);
  }, [activeTab, usuarioId]);

  // 🔹 Restaurar elemento
  const handleRestore = async (tipo, id) => {
    await restoreItem(tipo, id);
    await loadTrash(tipo);
  };

  // 🔹 Eliminar elemento permanentemente
  const handleDelete = async (tipo, id) => {
    if (window.confirm("¿Eliminar definitivamente este elemento?")) {
      await deleteItem(tipo, id);
      await loadTrash(tipo);
    }
  };

  const currentItems = trashData[activeTab];

  return (
    <div className="container">
      <h1>Papelera</h1>

      {/* 🔹 Pestañas */}
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🔹 Contenido */}
      <div className="trash-section">
        {loading ? (
          <p>Cargando...</p>
        ) : currentItems?.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="trash-item">
              <div className="item-title">{item.titulo || item.nombre}</div>
              <div className="item-meta">
                {item.descripcion && <p>{item.descripcion}</p>}
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-restore"
                  onClick={() => handleRestore(activeTab, item.id)}
                >
                  Restaurar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDelete(activeTab, item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="empty-category">
            No hay elementos eliminados en esta sección.
          </p>
        )}
      </div>
    </div>
  );
}
