# models/emocion.py
from app.db import Base
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class Emocion(Base):
    __tablename__ = "emocion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id", ondelete="CASCADE"), nullable=False)
    tipo_emocion_id = Column(Integer, ForeignKey("tipo_emocion.id", ondelete="CASCADE"), nullable=False)
    descripcion_emocion = Column(Text, nullable=True)
    fecha = Column(DateTime, server_default=func.now())  # Momento en que se registró la emoción
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())   # Cuándo se creó el registro
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  # Última modificación

    # Relaciones
    usuario = relationship("Usuario", back_populates="emociones")
    tipo_emocion = relationship("TipoEmocion")

    def __repr__(self):
        return f"<Emocion(id={self.id}, usuario_id={self.usuario_id}, tipo_emocion_id={self.tipo_emocion_id})>"
