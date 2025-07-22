from db import Base
from sqlalchemy import Column, Integer, String, Boolean

class LineaEmergencia(Base):
    __tablename__ = "linea_emergencia"
    id = Column(Integer, primary_key=True)
    nombreServicio = Column(String(255), nullable=False)
    numeroTelefono = Column(String(50), nullable=False)
    horarioAtencion = Column(String(255), nullable=True)
    medioContacto = Column(String(100), nullable=True)
    activo = Column(Boolean, default=True)