# models/promesa.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Enum # Importar Enum para tipos de datos ENUM
from db import Base
import datetime

class Promesa(Base):
    """
    Modelo de SQLAlchemy para la tabla 'promesa'.
    """
    __tablename__ = "promesa"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False)
    titulo = Column(String(255), nullable=False)
    descripcion = Column(Text, nullable=True)
    fechaCreacion = Column(DateTime, default=datetime.datetime.now)
    activo = Column(Boolean, default=True)
    # Definición del ENUM para tipo_frecuencia
    tipo_frecuencia = Column(Enum('Diario','Semanal', name='tipo_frecuencia_enum'), nullable=True)
    num_maximo_recaidas = Column(Integer, nullable=True)
    tecnica_afrontamiento_id = Column(Integer, ForeignKey('tecnicaafrontamiento.id'), nullable=True)

    # Relaciones
    usuario = relationship("Usuario", back_populates="promesas")
    tecnica_afrontamiento = relationship("TecnicaAfrontamiento", back_populates="promesas")
    fallos = relationship("Fallo", back_populates="promesa")

    def __repr__(self):
        return f"<Promesa(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
