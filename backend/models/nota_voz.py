from db import Base
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

class NotaVoz(Base):
    __tablename__ = "nota_voz"
    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    nombre = Column(String(255), nullable=False)
    ruta_archivo = Column(String(255), nullable=True) # Puede ser opcional si no se sube de inmediato
    fecha = Column(DateTime, server_default=func.now())
    pin_diario_requerido = Column(Boolean, default=False)
    activo = Column(Boolean, default=True)