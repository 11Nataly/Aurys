# models/motivacion.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
import datetime

class Motivacion(Base):
    """
    Modelo de SQLAlchemy para la tabla 'motivacion'.
    """
    __tablename__ = "motivacion"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    categoria_id = Column(Integer, ForeignKey('categoria.id'), nullable=True)
    titulo = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    fechaCreacion = Column(DateTime, default=datetime.datetime.now)
    esFavorita = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="motivaciones")
    categoria = relationship("Categoria", back_populates="motivaciones")

    def __repr__(self):
        return f"<Motivacion(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
