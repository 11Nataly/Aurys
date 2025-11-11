import React, { useState, useEffect } from "react";
import "./TrashSection.css";
import ModalConfirmacion from "./ModalConfirmacion"; // Importa el modal
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
  
  // Estado para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

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
    try {
      const data = await getTrashItems(usuarioId, tipo);
      setTrashData((prev) => ({ ...prev, [tipo]: data }));
    } catch (error) {
      console.error("Error cargando papelera:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (usuarioId) loadTrash(activeTab);
  }, [activeTab, usuarioId]);

  // 🔹 Restaurar elemento
  const handleRestore = async (tipo, id) => {
    try {
      await restoreItem(tipo, id);
      await loadTrash(tipo);
    } catch (error) {
      console.error("Error restaurando elemento:", error);
    }
  };

  // 🔹 Abrir modal de confirmación para eliminar
  const handleDeleteClick = (tipo, id, titulo) => {
    setItemToDelete({ tipo, id, titulo });
    setModalOpen(true);
  };

  // 🔹 Confirmar eliminación
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteItem(itemToDelete.tipo, itemToDelete.id);
        await loadTrash(itemToDelete.tipo);
      } catch (error) {
        console.error("Error eliminando elemento:", error);
      }
    }
    setModalOpen(false);
    setItemToDelete(null);
  };

  // 🔹 Cancelar eliminación
  const handleCancelDelete = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

  const currentItems = trashData[activeTab];

  return (
    <div className="container">
      <h1>🗑️ Papelera</h1>

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
          <div className="loading">Cargando...</div>
        ) : currentItems?.length > 0 ? (
          currentItems.map((item) => (
            <div key={item.id} className="trash-item">
              <div className="item-title">
                {item.titulo || item.nombre || "Sin título"}
              </div>
              <div className="item-meta">
                {item.descripcion && <p>{item.descripcion}</p>}
                {item.fecha_eliminado && (
                  <small>Eliminado: {new Date(item.fecha_eliminado).toLocaleDateString()}</small>
                )}
              </div>
              <div className="item-actions">
                <button
                  className="btn btn-restore"
                  onClick={() => handleRestore(activeTab, item.id)}
                >
                  🔄 Restaurar
                </button>
                <button
                  className="btn btn-delete"
                  onClick={() => handleDeleteClick(
                    activeTab, 
                    item.id, 
                    item.titulo || item.nombre
                  )}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-category">
            No hay elementos eliminados en {tabs.find(tab => tab.key === activeTab)?.label?.toLowerCase()}.
          </div>
        )}
      </div>

      {/* 🔹 Modal de Confirmación */}
      <ModalConfirmacion
        isOpen={modalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        titulo={`¿Estás seguro de que quieres eliminar definitivamente "${itemToDelete?.titulo || 'este elemento'}"?`}
        mensaje="Esta acción no se puede deshacer."
        textoConfirmar="Aceptar"
        textoCancelar="Cancelar"
      />
    </div>
  );
}