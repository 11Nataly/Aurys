# models/promesa.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Promesa(Base):
    """
    Modelo de SQLAlchemy para la tabla 'promesa'.
    Representa un compromiso del usuario, con posibilidad de recaídas y técnicas de afrontamiento.
    """
    __tablename__ = "promesa"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    activo = Column(Boolean, default=True)

    tipo_frecuencia = Column(Enum('Diario', 'Semanal', name='tipo_frecuencia_enum'), nullable=True)
    num_maximo_recaidas = Column(Integer, nullable=True)
    tecnica_afrontamiento_id = Column(Integer, ForeignKey('tecnicaafrontamiento.id', ondelete="SET NULL"), nullable=True)

    # Auditoría
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relaciones
    usuario = relationship("Usuario", back_populates="promesas")
    fallos = relationship("Fallo", back_populates="promesa", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Promesa(id={self.id}, titulo='{self.titulo}', usuario_id={self.usuario_id})>"
