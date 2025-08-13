# models/categoria.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Enum # Importar Enum para tipos de datos ENUM
from app.db import Base
import datetime

class Categoria(Base):
    """
    Modelo de SQLAlchemy para la tabla 'categoria'.
    """
    __tablename__ = "categoria"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    nombre = Column(String(255), nullable=False)
    esPredeterminada = Column(Boolean, default=False)
    # Definición del ENUM para tipoPredeterminado
    tipoPredeterminado = Column(Enum('logros','recuerdos','actividades','frases','familia','amigos', name='tipo_predeterminado_enum'), nullable=True)
    fechaCreacion = Column(DateTime, default=datetime.datetime.now)
    activo = Column(Boolean, default=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="categorias")
    motivaciones = relationship("Motivacion", back_populates="categoria")

    def __repr__(self):
        return f"<Categoria(id={self.id}, nombre='{self.nombre}', usuario_id={self.usuario_id})>"
