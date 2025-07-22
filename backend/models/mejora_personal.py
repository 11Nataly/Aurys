from db import Base
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

class MejorasPersonales(Base):
    __tablename__ = "mejoras_personales"
    id = Column(Integer, primary_key=True)
    promesa_id = Column(Integer, ForeignKey("promesa.id"), nullable=False)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False) # Redundante pero útil para consultas directas
    descripcion = Column(Text, nullable=True)
    fecha = Column(DateTime, server_default=func.now())
    activo = Column(Boolean, default=True)