from app.db import Base
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

class Emocion(Base):
    __tablename__ = "emocion"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    tipo_emocion_id = Column(Integer, ForeignKey("tipo_emocion.id"), nullable=False)
    descripcion_emocion = Column(Text, nullable=True)
    fecha = Column(DateTime, server_default=func.now())
    activo = Column(Boolean, default=True)