# models/notadiario.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class NotaDiario(Base):
    """
    Modelo de SQLAlchemy para la tabla 'notadiario'.
    Representa una entrada de diario creada por un usuario.
    """
    __tablename__ = "notadiario"
# Todo ese archivo realizado por douglas   
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False, index=True)
    contenido = Column(Text, nullable=False)
    activo = Column(Boolean, default=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="notadiarios")

    def __repr__(self):
        return f"<NotaDiario(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
