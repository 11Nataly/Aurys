from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class TecnicaAfrontamiento(Base):
    """
    Modelo de SQLAlchemy para la tabla 'tecnicaafrontamiento'.
    """
    __tablename__ = "tecnicaafrontamiento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # Este campo se mantiene para saber qué admin creó la técnica
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    video = Column(String(255), nullable=True)
    instruccion = Column(Text, nullable=True)


    duracion_video = Column(Integer, nullable=False)  # duración en segundos
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="tecnicasafrontamiento")

    favoritos = relationship("TecnicaFavorita", back_populates="tecnica_afrontamiento", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<TecnicaAfrontamiento(id={self.id}, nombre='{self.nombre}', usuario_id={self.usuario_id})>"
