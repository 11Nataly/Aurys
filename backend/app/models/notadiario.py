# models/notadiario.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db import Base
import datetime

class NotaDiario(Base):
    """
    Modelo de SQLAlchemy para la tabla 'notadiario'.
    """
    __tablename__ = "notadiario"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    titulo = Column(String(255), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(DateTime, default=datetime.datetime.now)
    activo = Column(Boolean, default=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="notadiarios")

    def __repr__(self):
        return f"<NotaDiario(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
