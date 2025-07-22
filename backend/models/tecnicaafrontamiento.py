# models/tecnicaafrontamiento.py
from sqlalchemy import Column, Integer, String, Text, DECIMAL, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db import Base

class TecnicaAfrontamiento(Base):
    """
    Modelo de SQLAlchemy para la tabla 'tecnicaafrontamiento'.
    """
    __tablename__ = "tecnicaafrontamiento"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    nombre = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    video = Column(String(255), nullable=True)
    instruccion = Column(Text, nullable=True)
    calificacion = Column(DECIMAL(2,1), nullable=True) # Usar DECIMAL para decimal(2,1)
    activo = Column(Boolean, default=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="tecnicasafrontamiento")
    promesas = relationship("Promesa", back_populates="tecnica_afrontamiento")

    def __repr__(self):
        return f"<TecnicaAfrontamiento(id={self.id}, nombre='{self.nombre}', usuario_id={self.usuario_id})>"
