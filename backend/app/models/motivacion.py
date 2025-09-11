# models/motivacion.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Motivacion(Base):
    """
    Modelo de SQLAlchemy para la tabla 'motivacion'.
    Representa algo que motiva al usuario, como un recuerdo, frase o logro.
    """
    __tablename__ = "motivacion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    categoria_id = Column(Integer, ForeignKey('categoria.id', ondelete="SET NULL"), nullable=True)
    titulo = Column(String(255), nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    esFavorita = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())  
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())  

    # Relaciones
    usuario = relationship("Usuario", back_populates="motivaciones")
    categoria = relationship("Categoria", back_populates="motivaciones")

    def __repr__(self):
        return f"<Motivacion(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
