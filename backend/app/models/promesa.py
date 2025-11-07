# app/models/promesa.py
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Promesa(Base):
    __tablename__ = "promesa"
# Todo ese archivo realizado por douglas   
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id', ondelete="CASCADE"), nullable=False)
    titulo = Column(String(255), nullable=False, index=True)
    descripcion = Column(Text, nullable=True)
    tipo_frecuencia = Column(Enum('Diario', 'Semanal', name='tipo_frecuencia_enum'), nullable=True)
    num_maximo_recaidas = Column(Integer, nullable=True)  # interpretado según frecuencia o global
    activo = Column(Boolean, default=True)      # papelera o activa
    cumplida = Column(Boolean, default=False)   # finalizada o en progreso
    fecha_inicio = Column(Date, server_default=func.current_date())
    fecha_fin = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    usuario = relationship("Usuario", back_populates="promesas")
    fallos = relationship("Fallo", back_populates="promesa", cascade="all, delete-orphan")
