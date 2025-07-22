from db import Base
from sqlalchemy import Column, Integer, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

class NotaDiario(Base):
    __tablename__ = "nota_diario"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    contenido = Column(Text, nullable=False)
    fecha = Column(DateTime, server_default=func.now())
    pin_diario_requerido = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)